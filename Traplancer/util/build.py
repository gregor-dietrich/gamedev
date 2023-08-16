RELEASE: bool = False
DEBUG: bool = True

import os
import zipfile


def list_all_files() -> [str]:
    files: [str] = []
    source_dir = "js" if os.path.exists("./js") else "../js"
    for root, dirs, filenames in os.walk(source_dir):
        for filename in filenames:
            if not filename == "phaser.min.js":
                files.append(os.path.join(root, filename).replace("\\", "/").replace("./", ""))
    return files


def generate_html(source: str) -> [str]:
    content: [str] = []
    scripts: [str] = list_all_files()
    # check if source is a file
    if not os.path.exists(source) or os.path.isdir(source):
        source = os.path.join(os.path.dirname(__file__), "template.html")
        if not os.path.exists(source) or os.path.isdir(source):
            raise FileNotFoundError(f"File not found: {source}")
    # read source file
    with open(source, mode="r", encoding="utf-8") as file:
        for line in file:
            if line.strip() == "</head>":
                for script in scripts:
                    script = script[1:] if script.startswith(".js") else script
                    content.append(f'\t<script type="text/javascript" src="{script}"></script>\n')
            content.append(line)
    return content


def write_html(content: [str], target: str = "index.html") -> None:
    if target == "index.html" and os.path.exists("template.html") and not os.path.exists("index.html"):
        target = "../index.html"
    with open(target, mode="w", encoding="utf-8") as file:
        file.writelines(content)


def zip_files(file_name: str = "release.zip") -> None:
    # create build folder if not exists
    target_dir = "release" if os.path.exists("./js") else "../release"
    if not os.path.exists(target_dir):
        os.mkdir(target_dir)
    # create a ZipFile object
    with zipfile.ZipFile(os.path.join(target_dir, file_name), "w", zipfile.ZIP_DEFLATED) as zip_file:
        # add index.html to the zip file
        zip_file.write("index.html", arcname="index.html")
        # add all files in subfolders to the zip file
        for sub_dir in ["css", "js", "assets"]:
            sub_dir = sub_dir if os.path.exists("./" + sub_dir) else "../" + sub_dir
            for root, dirs, filenames in os.walk(sub_dir):
                for filename in filenames:
                    zip_file.write(os.path.join(root, filename), arcname=os.path.join(root, filename).replace("\\", "/"))


if __name__ == "__main__":
    content: [str] = generate_html("template.html")
    write_html(content)
    if DEBUG:
        os.system("start http://localhost")
    if RELEASE:
        zip_files("Traplancer.zip")
