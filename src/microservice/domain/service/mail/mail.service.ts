import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService extends AbstractService {
    constructor(private mailerService: MailerService) {
        super();
    }

    async sendEmail(
        email: string,
        subject: string,
        template: string,
        dataCtx: any
    ) {
        this.logger.log('Sending email...');
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: subject,
            template: template, // `.hbs` extension is appended automatically
            context: dataCtx
        });
        this.logger.log('Email successfully sent!');
    }
}
