LAUNCH: bool = False
PACKAGE: bool = False

import os
import zipfile


def list_all_files() -> [str]:
    files: [str] = []
    for root, dirs, filenames in os.walk("js"):
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
            if line.strip() == "<title></title>":
                content.append(f"\t<title>{get_project_name()}</title>\n")
                continue
            if line.strip() == "</head>":
                for script in scripts:
                    script = script[1:] if script.startswith(".js") else script
                    content.append(f'\t<script type="text/javascript" src="{script}"></script>\n')
            content.append(line)
    return content


def write_html(content: [str], target: str = "index.html") -> None:
    with open(target, mode="w", encoding="utf-8") as file:
        file.writelines(content)


def zip_files(file_name: str, target_dir: str = "release") -> str:
    # create build folder if not exists
    if not os.path.exists(target_dir):
        os.mkdir(target_dir)
    # create a ZipFile object
    with zipfile.ZipFile(os.path.join(target_dir, file_name), "w", zipfile.ZIP_DEFLATED) as zip_file:
        # add index.html to the zip file
        zip_file.write("index.html", arcname="index.html")
        # add all files in subfolders to the zip file
        for sub_dir in ["css", "js", "assets"]:
            for root, dirs, filenames in os.walk(sub_dir):
                for filename in filenames:
                    zip_file.write(os.path.join(root, filename), arcname=os.path.join(root, filename).replace("\\", "/"))
    return os.path.join(target_dir, file_name)


def get_project_name() -> str:
    dir_name: str = os.path.dirname(__file__)
    return dir_name.split("//")[-2] if "//" in dir_name else dir_name.split("\\")[-2] if "\\" in dir_name else dir_name.split("/")[-2]


if __name__ == "__main__":
    project_name = get_project_name()
    print(f"Building {project_name}...")
    content: [str] = generate_html("template.html")
    write_html(content)
    print("HTML file generated.")
    if LAUNCH:
        os.system("start http://localhost")
        print("Project launched in browser.")
    if PACKAGE:
        output: str = zip_files(project_name + ".zip")
        print(f"Packaging finished: {output}")
    print("All operations complete.")
