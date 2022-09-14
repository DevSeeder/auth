import { MailService } from './../../../../../src/microservice/domain/service/mail/mail.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { mockMailerService } from '../../../../mock';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
    let sut: MailService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                MailService,
                {
                    provide: MailerService,
                    useValue: mockMailerService
                }
            ]
        }).compile();

        sut = app.get<MailService>(MailService);
    });

    describe('sendEmail', () => {
        it('should call sendEmail and call sendMail correctly', async () => {
            const mailSpy = sinon.spy(mockMailerService, 'sendMail');

            sut.sendEmail('any_email', 'any_subject', 'any_template', {});

            sinon.assert.calledOnceWithExactly(mailSpy, {
                to: 'any_email',
                subject: 'any_subject',
                template: 'any_template',
                context: {}
            });

            mailSpy.restore();
        });
    });
});
