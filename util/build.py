PROJECTROOT: str = "Mathrunner"
LAUNCH: bool = False
PACKAGE: bool = False

import os
import zipfile


def list_all_files() -> [str]:
    files: [str] = []
    for root, dirs, filenames in os.walk(os.path.join(PROJECTROOT, "js")):
        for filename in filenames:
            if not filename == "phaser.min.js":
                files.append(os.path.join(root, filename).replace("\\", "/").replace(PROJECTROOT + "/", ""))
    return files


def generate_html(source: str) -> [str]:
    content: [str] = []
    scripts: [str] = list_all_files()
    # check if source is a file
    if not os.path.exists(source) or os.path.isdir(source):
        source = os.path.join("util", "template.html")
        if not os.path.exists(source) or os.path.isdir(source):
            raise FileNotFoundError(f"File not found: {source}")
    # read source file
    with open(source, mode="r", encoding="utf-8") as file:
        for line in file:
            if line.strip() == "<title></title>":
                content.append(f"\t<title>{PROJECTROOT}</title>\n")
                continue
            if line.strip() == "</head>":
                for script in scripts:
                    script = script[1:] if script.startswith(".js") else script
                    content.append(f'\t<script type="text/javascript" src="{script}"></script>\n')
            content.append(line)
    return content


def write_html(content: [str], target: str = "index.html") -> None:
    with open(os.path.join(PROJECTROOT, target), mode="w", encoding="utf-8") as file:
        file.writelines(content)


def zip_files(file_name: str, target_dir: str) -> str:
    # create build folder if not exists
    if not os.path.exists(target_dir):
        os.mkdir(target_dir)
    # create a ZipFile object
    with zipfile.ZipFile(os.path.join(target_dir, file_name), "w", zipfile.ZIP_DEFLATED) as zip_file:
        # add index.html to the zip file
        zip_file.write(os.path.join(PROJECTROOT, "index.html"), arcname="index.html")
        # add all files in subfolders to the zip file
        sub_dirs: [str] = ["assets", "css", "js"]
        if os.path.exists(os.path.join(PROJECTROOT, "data")):
            sub_dirs.append("data")
        for sub_dir in sub_dirs:
            for root, dirs, filenames in os.walk(os.path.join(PROJECTROOT, sub_dir)):
                for filename in filenames:
                    zip_file.write(os.path.join(root, filename), arcname=os.path.join(root, filename).replace("\\", "/"))
    return os.path.join(target_dir, file_name)


if __name__ == "__main__":
    print(f"Building {PROJECTROOT}...")
    content: [str] = generate_html("template.html")
    write_html(content)
    print("HTML file generated.")
    if LAUNCH:
        os.system("start http://localhost/" + PROJECTROOT )
        print("Project launched in browser.")
    if PACKAGE:
        output: str = zip_files(PROJECTROOT + ".zip", "build");
        print(f"Packaging finished: {output}")
    print("All operations complete.")
