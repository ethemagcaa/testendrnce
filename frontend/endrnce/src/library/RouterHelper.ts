class RouterHelper {
    public static getCurrentUrl(pathname: string) {
        return pathname.split(/[?#]/)[0];
    }

    public static checkIsActive(pathname: string, url: string) {
        const current = RouterHelper.getCurrentUrl(pathname);

        if (!current || !url)
            return false;

        if (current === url)
            return true;

        return current.indexOf(url) > -1;
    }
}

export default RouterHelper;
