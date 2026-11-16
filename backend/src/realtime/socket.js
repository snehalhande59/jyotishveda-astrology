'use strict';

/**
 * Socket.IO Real-Time Chat Engine for Consultations
 * Preserved for real-time consultation messaging and AI assistant integration.
 */
module.exports = function initializeSocketIO({ strapi }) {
  if (!strapi.server || !strapi.server.httpServer) {
    return;
  }

  try {
    const { Server } = require('socket.io');
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/socket.io',
    });

    strapi.io = io;

    io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

        if (token) {
          try {
            const decoded = await strapi.service('plugin::users-permissions.jwt').verify(token);
            if (decoded?.id) {
              const user = await strapi.entityService.findOne('plugin::users-permissions.user', decoded.id);
              if (user && !user.blocked) {
                socket.user = user;
              }
            }
          } catch {
            // invalid token; allow guest connection for public status
          }
        }
        next();
      } catch (err) {
        next(err);
      }
    });

    io.on('connection', (socket) => {
      // Join a consultation session room
      socket.on('join_session', async ({ sessionId }, ack) => {
        try {
          if (!sessionId) {
            if (ack) ack({ success: false, error: 'sessionId is required' });
            return;
          }

          const isNumeric = /^\d+$/.test(String(sessionId));
          let session = null;
          if (isNumeric) {
            session = await strapi.entityService.findOne('api::chat-session.chat-session', parseInt(sessionId, 10), {
              populate: ['user', 'astrologer'],
            });
          } else {
            const found = await strapi.entityService.findMany('api::chat-session.chat-session', {
              filters: { sessionNumber: String(sessionId) },
              populate: ['user', 'astrologer'],
              limit: 1,
            });
            session = found && found.length > 0 ? found[0] : null;
          }

          if (!session) {
            if (ack) ack({ success: false, error: 'Session not found' });
            return;
          }

          if (socket.user && session.user && session.user.id !== socket.user.id) {
            if (ack) ack({ success: false, error: 'Access denied' });
            return;
          }

          const roomName = `session_${session.id}`;
          socket.join(roomName);

          const participantType = socket.user?.id === session.user?.id ? 'user' : 'astrologer';
          socket.to(roomName).emit('user_status', {
            userId: socket.user?.id || 'guest',
            username: socket.user?.username || 'Seeker',
            role: participantType,
            status: 'online',
            timestamp: new Date().toISOString(),
          });

          if (ack) {
            ack({
              success: true,
              sessionId: session.id,
              status: session.status,
              remainingSeconds: Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)),
            });
          }
        } catch (joinErr) {
          if (ack) ack({ success: false, error: joinErr.message });
        }
      });

      // Typing indicator
      socket.on('typing', ({ sessionId, isTyping }) => {
        if (!sessionId) return;
        const senderName = socket.user?.username || 'Seeker';
        socket.to(`session_${sessionId}`).emit('user_typing', {
          sessionId,
          senderName,
          isTyping: Boolean(isTyping),
        });
      });

      // Real-time message dispatch over WebSocket
      socket.on('send_message', async ({ sessionId, message, mode = 'human' }, ack) => {
        try {
          if (!socket.user) {
            if (ack) ack({ success: false, error: 'Authentication required to post messages' });
            return;
          }

          if (!sessionId || !message || typeof message !== 'string' || message.trim().length === 0) {
            if (ack) ack({ success: false, error: 'Valid sessionId and message are required' });
            return;
          }

          const isNumeric = /^\d+$/.test(String(sessionId));
          let session = null;
          if (isNumeric) {
            session = await strapi.entityService.findOne('api::chat-session.chat-session', parseInt(sessionId, 10), {
              populate: ['user', 'astrologer'],
            });
          } else {
            const found = await strapi.entityService.findMany('api::chat-session.chat-session', {
              filters: { sessionNumber: String(sessionId) },
              populate: ['user', 'astrologer'],
              limit: 1,
            });
            session = found && found.length > 0 ? found[0] : null;
          }

          if (!session) {
            if (ack) ack({ success: false, error: 'Session not found' });
            return;
          }

          if (session.user && session.user.id !== socket.user.id) {
            if (ack) ack({ success: false, error: 'Access denied' });
            return;
          }

          const now = Date.now();
          const expiresAt = new Date(session.expiresAt).getTime();
          if (now >= expiresAt || session.status === 'expired' || session.status === 'completed') {
            if (ack) ack({ success: false, error: 'Consultation session has expired or concluded' });
            return;
          }

          const userMsg = await strapi.entityService.create('api::chat-message.chat-message', {
            data: {
              session: session.id,
              senderType: 'user',
              senderName: socket.user.username,
              message: message.trim(),
              timestamp: new Date(),
            },
          });

          const roomName = `session_${session.id}`;
          io.to(roomName).emit('new_message', userMsg);

          let astrologerReply = null;
          let newCount = session.messageCount + 1;

          if (mode === 'ai') {
            const history = await strapi.entityService.findMany('api::chat-message.chat-message', {
              filters: { session: session.id },
              sort: { timestamp: 'desc' },
              limit: 6,
            });

            let aiResult;
            if (strapi.service('api::ai.ai')) {
              aiResult = await strapi.service('api::ai.ai').generateAstrologyGuidance({
                message: message.trim(),
                history: history.reverse(),
                birthChart: session.birthChartSummary,
                language: 'en',
              });
            } else {
              aiResult = {
                configured: false,
                message: 'AI Service not initialized.',
              };
            }

            if (aiResult.configured && aiResult.reply) {
              astrologerReply = await strapi.entityService.create('api::chat-message.chat-message', {
                data: {
                  session: session.id,
                  senderType: 'astrologer',
                  senderName: 'JyotishVeda AI Assistant',
                  message: aiResult.reply,
                  timestamp: new Date(),
                },
              });
              newCount += 1;
              io.to(roomName).emit('new_message', astrologerReply);
            }
          }

          await strapi.entityService.update('api::chat-session.chat-session', session.id, {
            data: {
              messageCount: newCount,
              status: newCount >= session.maxMessages ? 'completed' : 'active',
            },
          });

          if (ack) {
            ack({
              success: true,
              userMessage: userMsg,
              astrologerResponse: astrologerReply,
            });
          }
        } catch (msgErr) {
          if (ack) ack({ success: false, error: msgErr.message });
        }
      });

      socket.on('disconnect', () => {});
    });

    console.log('⚡ Socket.IO real-time engine attached to Strapi HTTP server successfully.');
  } catch (socketErr) {
    console.warn('Socket.IO initialization notice:', socketErr.message);
  }
};
