'use strict';

const _ = require('lodash');

module.exports = (plugin) => {
  const originalProvidersService = plugin.services.providers;

  plugin.services.providers = ({ strapi }) => {
    const service = originalProvidersService({ strapi });

    return {
      ...service,
      async connect(provider, query) {
        const accessToken = query.access_token || query.code || query.oauth_token;

        if (!accessToken) {
          throw new Error('No access_token.');
        }

        const profile = await strapi
          .plugin('users-permissions')
          .service('providers-registry')
          .run({
            provider,
            query,
            accessToken,
            providers: await strapi
              .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
              .get(),
          });

        const email = _.toLower(profile.email);

        if (!email) {
          throw new Error('Email was not available.');
        }

        const users = await strapi.db.query('plugin::users-permissions.user').findMany({
          where: { email },
        });

        const advancedSettings = await strapi
          .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
          .get();

        const user = _.find(users, { provider });

        if (!_.isEmpty(user)) {
          return user;
        }

        // Seamless OAuth Account Linking:
        // If an account with this verified email already exists in the system (e.g. registered via password),
        // automatically link and authenticate the user without throwing 'Email is already taken'.
        if (users && users.length > 0) {
          return users[0];
        }

        if (!advancedSettings.allow_register) {
          throw new Error('Register action is actually not available.');
        }

        // Retrieve default role
        const defaultRole = await strapi.db
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: advancedSettings.default_role } });

        // Create the new user
        const newUser = {
          ...profile,
          email,
          provider,
          role: defaultRole ? defaultRole.id : undefined,
          confirmed: true,
        };

        const createdUser = await strapi.db
          .query('plugin::users-permissions.user')
          .create({ data: newUser });

        return createdUser;
      },
    };
  };

  return plugin;
};
