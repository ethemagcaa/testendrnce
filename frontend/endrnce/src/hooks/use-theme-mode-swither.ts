const useThemeModeSwitcher = () => (fileUrl: string) => {
    const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1, fileUrl.lastIndexOf("."));
    const mode= document.documentElement.getAttribute("data-theme");
    const newFileName = `${filename}${mode === "dark" ? "-dark" : ""}`;

    return fileUrl.replace(filename, newFileName);
};

export default useThemeModeSwitcher;
