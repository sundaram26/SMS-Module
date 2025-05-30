import MSG91 from 'msg91';

class SMSProviderFactory {
  static getProvider(provider, config) {
    switch (provider.toLowerCase()) {
      case 'msg91':
        return new MSG91Provider(config);
      default:
        return new CustomProvider(config);
    }
  }
}

class MSG91Provider {
  constructor(config) {
    this.msg91 = new MSG91(config.authKey);
    this.senderId = config.senderId;
    this.route = config.route || 4;
  }

  async sendSMS(to, message) {
    try {
      const response = await this.msg91.send({
        to: [to],
        message,
        sender: this.senderId,
        route: this.route
      });
      return {
        success: true,
        response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

class CustomProvider {
  constructor(config) {
    this.config = config;
  }

  async sendSMS(to, message) {
    try {
      // The custom provider implementation will be handled by the client
      // This is just a placeholder that will be overridden
      const response = await this.config.sendFunction(to, message);
      return {
        success: true,
        response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export { SMSProviderFactory, MSG91Provider, CustomProvider }; 