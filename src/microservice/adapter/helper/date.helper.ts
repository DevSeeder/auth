import { EnumTimePattern } from '../../domain/enum/time-pattern.enum';
import { StringHelper } from './string.helper';

export class DateHelper {
    static GetDateNow(timeZone = 'America/Sao_Paulo') {
        const dateLocal =
            new Date()
                .toLocaleString('en-CA', { timeZone, hour12: false })
                .replace(/, /, 'T') + '.000Z';
        return new Date(dateLocal);
    }

    static GetServerDateNow() {
        const dateLocal = new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
        ).toISOString();
        return new Date(dateLocal);
    }

    static SetAddDate(
        setTime: string,
        date: Date = null,
        timeZone = 'America/Sao_Paulo'
    ): Date {
        const dateLocal = date ?? this.GetDateNow(timeZone);
        const patternTime = StringHelper.ExtractLetters(setTime);
        const setValue = StringHelper.ExtractNumbers(setTime);
        switch (patternTime) {
            case EnumTimePattern.HOUR:
                dateLocal.setHours(dateLocal.getHours() + setValue);
                break;
        }
        return dateLocal;
    }
}
