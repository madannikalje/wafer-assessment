import { Twilio } from "twilio";

class SMSService {
    private twilio: Twilio;
    private serviceId: string;

    constructor() {
        const env = process.env;
        this.serviceId = env.TWILIO_SERVICE_ID;
        this.twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    }

    public async sendVerificationCode(mobileNumber: string) {
        return this.twilio.verify.services(this.serviceId)
            .verifications.create({ to: `+91${mobileNumber}`, channel: "sms" });
    }

    public async verifyCode(mobileNumber: string, code: string) {
        return this.twilio.verify.services(this.serviceId)
            .verificationChecks.create({ to: `+91${mobileNumber}`, code });
    }
}

export const smsService = new SMSService();