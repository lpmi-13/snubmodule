# SnubModule

Following on from the [submodz](https://github.com/lpmi-13/submodz) micromaterial, this is a similar activity to practice merging a submodule into your main repo.

This would happen when you decide, for whatever reason, that you don't feel like
tracking the module/library/etc as a submodule anymore, and so you just want it
to be all tracked in the parent repository.

## The project (with a submodule, at the beginning)

**(NOTE: clone this with `git clone --recursive ...` to get all the submodules)**

Just like last time, we just want to start up a local server and show the
chances that it's gonna be awesome in that city. And we're currently using our
submodule (transform) to output some percentages.

```
npm install
node index.js
```

should fire up your server and have you ready to rock at `localhost:3000`

## check that everything's working

to see some of the output, open a second terminal and try

```
curl localhost:3000/london
// the predicted awesomeness in london is 20.25%
```

and if you want to see where the submodule is pointing to...

```
git submodule
```

the output should look something like:

```
 9399af58422259a04556c09395cc4efda7bab4bf transform (heads/master)
```

## now let's change something!

Maybe the team who was responsible for managing the `transform` repo has now
disbanded, or moved on, or for whatever reason isn't interested in supporting this external repo anymore.

You could offer to take over ownership of it, but if you're the only team using it, you might as well just pull it into the only codebase that's actually using it.

So first we need to de-register it as a submodule and get it added to the main repo.

## update the submodule

**(NOTE: if you don't care about preserving the git history, then just copy the submodule into the main repo and commit the entire thing. If you DO care about preserving history, then read on!)**

you can skip the first step and move directly to step 2 if you want, you just won't have the same directory/file structure at the end of the process, and you might need to update some file paths to get it to work again after merging.

the following steps are mostly taken from [this article](https://medium.com/walkme-engineering/how-to-merge-a-git-submodule-into-its-main-repository-d83a215a319c), so if you'd like to read that for a bit more context before you continue, go ahead.

### 1) update the directory/file structure

back in your main repo, enter the submodule directory, and lets start with updating the directory structure, so we can clean up the references to the submodule and after final merging we will have the same structure as before:

(from the `transform` directory)
```bash
mkdir transform
git mv {README.md,transform.js} transform
git commit -m 'update directory structure prior to merging into parent repo'
git push origin master
```
(if you wanna use the fancier `xargs` pipe style from the link above, feel free, since we only have two files in our submodule, it's easy enough to just use the filenames explicitly)

### 2) remove all references to the submodule

There are a few places that git currently contains information about the submodule, so let's remove each one in turn:

- let's remove the `.gitmodules` file.

The reason we can just delete this file instead of editing it is because we currently only have one submodule mentioned in the file.

If you'd like to confirm that, just take a look at the file, and you should see the following:

```
[submodule "transform"]
        path = transform
        url = git@github.com:YOUR_USERNAME/submodule-transform
```

so let's go ahead and just get rid of that file.

```bash
rm .gitmodules
```

- update `.git/config`

if you take a look at this file, you should see something like the following:

```
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
[remote "origin"]
        url = git@github.com:YOUR_USERNAME/submodz
        fetch = +refs/heads/*:refs/remotes/origin/*
[submodule "transform"]
        url = git@github.com:YOUR_USERNAME/submodule-transform
```

the part we care about is everyting in the `[submodule "transform"]` section, so you can delete that part.

- delete the `.git/modules` directory

again, if there were multiple submodules referenced here, we would probably just edit it, but since there's only one submodule listed there, we can remove the entire thing.

Let's confirm that anyway. Go ahead and list the contents of `.git/modules`, and you should see something like:

```
.  ..  transform
```

Delete it however you like, the easiest way is something like `rm -rf .git/modules`

- remove the remaining (now untracked) `transform` directory

Since we've removed all references to this directory as a submodule, we can delete it (we'll bring it back later)

```bash
rm -rf transform
```

- commit the changes so we get those in the log

```bash
git commit -m 'get that submodule out of here!'
```

### 3) merge the submodule in as "regular" code

- add the submodule as a git remote instead of a submodule

This allows us to pull in the code (and the git history) to our main repo.

```bash
git remote add original-submodule git@github.com/YOUR_USERNAME/submodule-transform
```

- make sure we have the latest commits from the remote

```bash
git fetch original-submodule
```

this should result in some terminal output that looks like:

```bash
warning: no common commits
remote: Enumerating objects: 6, done.
remote: Counting objects: 100% (6/6), done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 6 (delta 0), reused 6 (delta 0), pack-reused 0
Unpacking objects: 100% (6/6), done.
From github.com:lpmi-13/submodule-transform
 * [new branch]      master     -> original-submodule/master
```

- and merge it into the main repo

```bash
git merge original-submodule/master
```
**(NOTE: you may need to add `--allow-unrelated-histories` to the merge command if you get an error)**

- get rid of the git remote, since we only have one main repo, so one main remote

```bash
git remote remove original-submodule
```


for the curious, your git history (with `git log --graph`) should look like this, showing that the two commits from the submodule have now been merged in:

```bash
*   commit 8d26aba61cc1bad03e019cd2ca01a12377913ac7
|\  Merge: 01fcbb7 374a057
| | Author: Adam Leskis <leskis@gmail.com>
| | Date:   Tue Sep 8 13:30:42 2020 +0100
| | 
| |     Merge remote-tracking branch 'origin-submodule/master' into main
| |   
| * commit 374a0574cd04de579253cfd356eabc2e6bcf11c3
| | Author: Adam Leskis <leskis@gmail.com>
| | Date:   Tue Sep 8 13:15:54 2020 +0100
| | 
| |     update directory structure for merging
| |   
| * commit 0132d18fb76324cce2635a3d55305a92236cc1b7
|   Author: Adam Leskis <leskis@gmail.com>
|   Date:   Sat Jul 25 06:24:52 2020 +0100
|   
|       initial commit
|  
* commit 01fcbb77826b6f2a2f8cb7ce67c787bab14c8aa9
| Author: Adam Leskis <leskis@gmail.com>
| Date:   Tue Sep 8 13:24:58 2020 +0100
| 
|     remove the submodules
|  
* commit a7c512e630fba3c6e56c5041b17e358a677ced81
| Author: Adam Leskis <leskis@gmail.com>
| Date:   Tue Sep 8 11:07:23 2020 +0100
| 
|     readme almost there
|  
* commit b6da3ec9ff6ab9e71283ab1e9d3e2f593652456b
  Author: Adam Leskis <leskis@gmail.com>
  Date:   Thu Aug 27 23:31:31 2020 +0100
  
      initial commit...not there yet
```

As a final check, let's make the predictions even more optimistic than they previously were, just to make sure we're tracking all the code in one repo.

update `/transform/transform.js` from:

```
const transform = inputNumber => inputNumber * 0.25;
```

to

```
const transform = inputNumber => 100;
```

and now when you run `git status`, you should see the output showing that file is being tracked in the parent repo instead of as a submodule:

```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   transform/transform.js
```

let's commit that, so we've got it all, and finally, let's fire up the server locally to make sure everything still works:

```bash
node index.js
```

and in a second terminal:

```
curl localhost:3000/london
// the predicted awesomeness in london is 100%
```

looks like it's gonna be a wonderful sunny day! That's it, you've successfully merged a submodule back into the parent repo.
