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

Maybe a few questions we'll need to answer at some point
1. What should the content of the tweet be?

## Taking action

Okay, so! New GitHub Action time?

---

[[Daily Notes/2021-05-17|May 17th, 2021]]

I borrowed the base action from [obsidian-tools](https://github.com/zephraph/obsidian-tools/blob/main/.github/workflows/release.yml) just because I'm familiar with that. 

I deleted some of the bottom parts and sort of left it. I've had trouble focusing today and there's some specifics about GitHub actions that I probably need to jump into... but I just don't wanna? I know that it's a thing that I need to do that I'm procrastinating on so I'm going to use [[structured procrastination]] to encourage myself to hit the problem from a different angle. 

---

Okay, so I'm actually pretty interested in the process for sending the tweet so I'm going to hit it from that angle. I'm going to use [FeedHive's twitter api client](https://github.com/FeedHive/twitter-api-client).

It took a bit to find the API to call to actually issue the tweet. [Here's what we need to call](https://github.com/FeedHive/twitter-api-client/blob/main/REFERENCES.md#twitterclienttweetsstatusesupdateparameters).


_to be continued_