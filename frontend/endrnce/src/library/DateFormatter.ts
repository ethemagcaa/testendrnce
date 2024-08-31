import moment from "moment-timezone";

class DateFormatter {

    private readonly timeZone: string;

    public constructor() {
        const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
        this.timeZone = timeZone;

        moment.locale("en");
        moment.tz.setDefault(this.timeZone);
    }

    public changeLocale(i18n: string): DateFormatter {
        moment.locale(i18n);

        return this;
    }

    public fromNow(text: string) {
        return moment.utc(text).tz(this.timeZone).fromNow();
    }

    public format(text: string): string {
        return moment.utc(text).tz(this.timeZone).format("LLL");
    }
}

export default new DateFormatter();
