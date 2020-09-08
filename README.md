# UnMerge Me

Following on from the [submodz](https://github.com/lpmi-13/submodz) micromaterial, this is a similar activity to practice merging a submodule into your main repo.

This would happen when you decide, for whatever reason, that you don't feel like
tracking the module/library/etc as a submodule anymore, and so you just want it
to be all tracked in the parent repository.

## The project (with a submodule, at the beginning)

Just like last time, we just want to start up a local server and show the
chances that it's gonna be awesome in that city. And we're currently using our
submodule (transform) to output some percentages.

```
npm install
node index.js
```

should fire up your server and have you ready to rock at `localhost:3000`

## check the submodule

to see some of the output, try

```
curl localhost:3000/london
// the predicted awesomeness in london is 86%
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
disbanded, or moved on, or for whatever reason isn't interested in supporting this external repo anymore. You could offer to take over ownership of it, but if you're the only team using it, you might as well just pull it into the only
codebase that's actually using it.

So first we need to de-register it as a submodule and get it added to the main repo.

## update the submodule

**(NOTE: if you don't care about preserving the git history, then just copy the submodule into the main repo and commit the entire thing. If you DO care about preserving history, then read on!)**

back in your main repo, lets start with moving the files temporarily, so we can clean up the references to the submodule:

- you can skip this first step and move directly to step 2, you just won't have the same directory/file structure at the end of the process

the following steps are mostly taken from [this article](https://medium.com/walkme-engineering/how-to-merge-a-git-submodule-into-its-main-repository-d83a215a319c), so if you'd like to read that for a bit more context before you continue, go ahead.

1) update the directory/file structure

(from the root directory)
```bash
mkdir transform-temp
cp
```

```
git submodule deinit --force
```

you should see that your submodule has been updated, with terminal output like the following:

```
   9399af5..12f80cf  master     -> origin/master
Submodule path 'transform': checked out '12f80cfb707459bac790fd50d9982706a1913037'
```

2) remove all references to the submodule

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
        url = git@github.com:lpmi-13/submodz
        fetch = +refs/heads/*:refs/remotes/origin/*
[submodule "transform"]
        url = git@github.com:lpmi-13/submodule-transform
```

the part we care about is everyting in the `[submodule "transform"]` section, so you can delete that part.

- delete the `.git/modules` directory

again, if there were multiple submodules referenced here, we would probably just edit it, but since there's only one submodule listed there, we can remove the entire thing.

Let's go ahead and confirm that anyway. Go ahead and list the contents of `.git/modules`, and you should see something like:

```
.  ..  transform
```

Delete it however you like, the easiest way is something like `rm -rf .git/modules`

- commit the changes so we get those in the log

```bash
git commit -m 'get that submodule out of here!'
```

- remove the remaining (now untracked) `transform` directory

Since we've removed all references to this directory as a submodule, we can delete it (we'll bring it back later)

```bash
rm -rf transform
```

3) merge the submodule in as "regular" code

- add the submodule as a git remote instead of a submodule

This allows us to pull in the code (and the git history) to our main repo.

```bash
git remote add original-submodule git@github.com/YOUR_USERNAME/submodule-transform
```

- make sure we have the latest commits from the remote

```bash
git fetch original-submodule
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


for the curious, your git history (with `git log -p`) should look like this:

...and that's it! You have successfully merged a submodule into the main project.
