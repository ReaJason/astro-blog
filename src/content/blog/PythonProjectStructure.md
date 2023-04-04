---
title: Structuring Your Python Project
tags: [Notes]
categories: [Python]
date: "2023-04-04 12:00:00"
description: "项目结构是项目架构的重要组成部分，对于健康的开发周期至关重要"
---
> By “structure” we mean the decisions you make concerning how your project best meets its objective. We need to consider how to best leverage Python’s features to create clean, effective code. In practical terms, “structure” means making clean code whose logic and dependencies are clear as well as how the files and folders are organized in the filesystem.

## Structure of the Repository

### First Look

```
├──CHANGELOG.md
├──docs
├──LICENSE
├──Makefile
├──README.md
├──requirements.txt
├──setup.py
├──tests
│  ├──__init__.py
│  └──test_xhs.py
└──sample
   ├──__init__.py
   ├──core.py
   └──help.py
```

My first practice project, [xhs](https://github.com/ReaJason/xhs), is available on GitHub.

### CHANGELOG.md

To keep track of changes made to software over time, a changelog is a file that contains a chronologically ordered list of significant updates for each version. For guidance on how to maintain a changelog within your repository, refer to this [guide](https://keepachangelog.com/en/1.1.0/)

```md
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2023-03-05

### Added

- Arabic translation (#444).

### Fixed

- Improve French translation (#377).

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file
```

### docs

The package reference documentation is located here. To generate and maintain the documentation, you can use the [Sphinx](https://www.sphinx-doc.org/en/master/) documentation tool.

To use Sphinx to generate and maintain documentation, start by installing it from PyPI using the following command: `pip install -U sphinx`. Then, navigate to the `docs` directory and run `sphinx-quickstart` to set up the project.

```bash
pip install -U sphinx
```

```bash
cd docs
sphinx-quickstart
```

Once you have set up the Sphinx project, you can generate the documentation by running the `make html` command. This will create an HTML version of the documentation that you can then distribute to your users.

```bash
make html
```

### LICENSE

This is arguably the most important part of your repository, aside from the source code itself. The full license text and copyright claims should exist in this file. If you aren’t sure which license you should use for your project, check out [choosealicense.com](http://choosealicense.com/).

### Makefile

make is an incredibly useful tool for defining generic tasks for your project. You deserve it.

```makefile
.PHONY: docs
init:
		pip install -r requirements.txt
ci:
		pytest tests --junitxml=report.xml
test:
		tox -p
upload:
		python setup.py sdist bdist_wheel
		twine upload dist/*
		rm -fr build dist .egg xhs.egg-info
docs:
		cd docs && make html
```

As an example, if you were to run the command `make init`, it would effectively run the command `pip install -r requirements.txt`.

### README.md

Your project's README.md file serves as an introduction to your work and should include essential information such as the title, description, usage instructions, and licensing information.

### requirements.txt

It should specify the dependencies required to contribute to the project: testing, building, and generating documentation.

### setup.py

the package and distribution management. to build your project run command `python setup.py sdist bdist_wheel  `, then it will build wheel file and source file in `./dist` directory. there is a `setup.py` example

```py
from setuptools import setup

with open("README.md", "r", encoding="utf-8") as f:
    readme = f.read()


setup(
    name="your_package_name",
    version="version",
    description="description",
    long_description=readme,
    long_description_content_type="text/markdown",
    author="author",
    author_email="author_email"],
    url=about"url",
    license=about"license",
    packages=["your_package_name"],
    install_requires=["require1", "require2"],
    keywords="keyword1 keyword2",
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.7",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3 :: Only",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
```

### tests

To use `pytest` to run all of your test files, you can simply execute the command `pytest tests`.

### sample

Depending on the size of your project, your application package may be as simple as a single file, such as `sample.py`.

### reference project

- [requests](https://github.com/psf/requests)
- [Howdoi](https://github.com/gleitz/howdoi)

## Automate projects with GitHub actions

### auto test:

```yml
# .github/workflows/test.yml

name: Tests

on: [push, pull_request]

permissions:
  contents: read

jobs:
  build:
    runs-on: ${{ matrix.os }}
    timeout-minutes: 10
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.7", "3.8", "3.9", "3.10", "3.11"]
        os: [ubuntu-20.04, macOS-latest, windows-latest]
        include:
          - python-version: pypy-3.7
            os: ubuntu-latest
            experimental: false

    steps:
      - uses: actions/checkout@v2
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v2
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          make init
      - name: Run tests
        run: |
          make ci
```

### auto build doc

```yml
# .github/workflows/doc.yml

name: Sphinx Doc

on:
  push:
    branches: [master, docs]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build HTML
        uses: ammaraskar/sphinx-action@master
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: html-docs
          path: docs/_build/html/
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }}
          publish_dir: docs/_build/html

```

### auto upload PyPI

```yml
# .github/workflows/pypi.yml
name: PyPI

on:
  push:
    branches:
      - master

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags')
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v3
        with:
          python-version: "3.x"
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          make
          pip install build
      - name: Build package
        run: python -m build
      - name: pypi-publish
        uses: pypa/gh-action-pypi-publish@v1.8.5
        with:
          user: __token__
          password: ${{ secrets.PYPI_API_TOKEN }}
```

## Further Reading

- [The Hitchhiker’s Guide to Python - Structuring Your Project](https://docs.python-guide.org/writing/structure/)
- [how to write a good readme file](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/)
- [add command to git bash](https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058)

