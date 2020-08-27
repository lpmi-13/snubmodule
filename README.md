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

## add the submodule

to see some of the output, try

```
curl localhost:3000/london
// the predicted awesomeness in london is 1.5%
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

back in your main repo, if you type

```
git submodule deinit --force
```

you should see that your submodule has been updated, with terminal output like the following:

```
   9399af5..12f80cf  master     -> origin/master
Submodule path 'transform': checked out '12f80cfb707459bac790fd50d9982706a1913037'
```

and when you run the server locally, and try to find out the predicted awesomeness in a city, it should be some ridiculously too high number:

```
curl localhost:3000/chicago
// the predicted awesomeness in chicago is 3200%
```

the only last slight difference from normal git updates is that when you type

```
git status
```

you'll see something slightly different in the output, like so:

```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   transform (new commits)
```

...rather than just the file name that got updated (`/transform/transform.js`) as you might expect. This is just the way that git shows updates in submodules,
and something to be aware of.

Now to finish off the exercise, add and commit that, and we're all done!

for the curious, your git history (with `git log -p`) should look like this:

```
diff --git a/transform b/transform
index 9399af5..12f80cf 160000
--- a/transform
+++ b/transform
@@ -1 +1 @@
-Subproject commit 9399af58422259a04556c09395cc4efda7bab4bf
+Subproject commit 12f80cfb707459bac790fd50d9982706a1913037
```

to show that we've updated the commit of the submodule that our repo is using.

...and that's it! You have successfully used and updated a submodule in a project.
