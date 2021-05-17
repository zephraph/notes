[[Daily Notes/2021-05-16|May 16th, 2021]]

We've got an [issue](https://github.com/devtools-fm/devtools.fm/issues/11) up for automating sending out a tweet when we launch a new episode. I figured I'd dive into solving that this evening.

## Breaking down the problem

Alright, so what are we trying to do here?

In our [`pages`](https://github.com/devtools-fm/devtools.fm/tree/main/pages) directory, there's an `episode` directory that contains all of our episodes. These are pretty simple files titled like `3.mdx` where `3` is the episode number. 

Essentially when a new `mdx` file is added to this directory on our `main` branch then we'll want to issue the tweet. There could be a question here about if we should delay sending the tweet, but I'll defer that for now.

To explicitly break it down, it seems like we have a few steps here
1. Create a GitHub action
2. Check if an episode file has been added to the `episode` directory
3. If the above is true, send a new tweet