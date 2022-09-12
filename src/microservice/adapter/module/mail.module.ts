import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from '../../domain/service/mail/mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
                // or
                transport: {
                    host: config.get<string>('email.host'),
                    secure: config.get<boolean>('email.secure'),
                    port: config.get<number>('email.port'),
                    auth: {
                        user: config.get<string>('email.sender'),
                        pass: config.get<string>('email.password')
                    }
                },
                defaults: {
                    from: `"No Reply - DevSeeder" <${config.get<string>(
                        'email.sender'
                    )}>`
                },
                template: {
                    dir: join(process.cwd(), 'src', 'mail', 'templates'),
                    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                    options: {
                        strict: true
                    }
                }
            })
        })
    ],
    providers: [MailService],
    exports: [MailService] // 👈 export for DI
})
export class MailModule {}
