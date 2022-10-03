#!/bin/bash

# $1 = Changes
# $2 = Branch

git add .
git commit -m "$1"
git push -uf origin paul-bastelt
#git push -uf paulgit paul-bastelt
