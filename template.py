import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import (
    Template,
    PackageType,
    Dependencies,
    RunTimeDeps,
    generate_template,
    Bundles,
    MainModule,
    AuxiliaryModule,
)
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / "package.json")


template = Template(
    path=folder_path,
    type=PackageType.Library,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            externals={
                "@youwol/vsf-core": "^0.1.2",
                "@youwol/cdn-client": "^2.0.4",
                "three": "^0.152.0",
                "rxjs": "^6.5.5",
            }
        )
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./lib/toolbox.ts", loadDependencies=["@youwol/vsf-core"]
        ),
        auxiliaryModules=[
            AuxiliaryModule(
                name="uniform-remeshing",
                entryFile="./lib/uniform-remeshing.module.ts",
                loadDependencies=["@youwol/vsf-core", "@youwol/cdn-client", "rxjs"],
            ),
            AuxiliaryModule(
                name="adaptive-remeshing",
                entryFile="./lib/adaptive-remeshing.module.ts",
                loadDependencies=["@youwol/vsf-core", "@youwol/cdn-client", "rxjs"],
            ),
            AuxiliaryModule(
                name="explicit-smoothing",
                entryFile="./lib/explicit-smoothing.module.ts",
                loadDependencies=["@youwol/vsf-core", "@youwol/cdn-client", "rxjs"],
            ),
            AuxiliaryModule(
                name="implicit-smoothing",
                entryFile="./lib/implicit-smoothing.module.ts",
                loadDependencies=["@youwol/vsf-core", "@youwol/cdn-client", "rxjs"],
            ),
            AuxiliaryModule(
                name="to-three",
                entryFile="./lib/to-three.module.ts",
                loadDependencies=["@youwol/vsf-core", "three", "rxjs"],
            ),
            AuxiliaryModule(
                name="from-three",
                entryFile="./lib/from-three.module.ts",
                loadDependencies=["@youwol/vsf-core", "rxjs"],
            ),
        ],
    ),
    userGuide=True,
)

generate_template(template)
shutil.copyfile(
    src=folder_path / ".template" / "src" / "auto-generated.ts",
    dst=folder_path / "src" / "auto-generated.ts",
)
for file in [
    "README.md",
    ".gitignore",
    ".npmignore",
    ".prettierignore",
    "LICENSE",
    "package.json",
    "tsconfig.json",
    "webpack.config.ts",
]:
    shutil.copyfile(src=folder_path / ".template" / file, dst=folder_path / file)
