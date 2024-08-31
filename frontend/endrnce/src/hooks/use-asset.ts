const useAsset = () => (pathname: string) => {
    const publicPath = process.env.PUBLIC_URL;

    return publicPath + pathname;
};

export default useAsset;
