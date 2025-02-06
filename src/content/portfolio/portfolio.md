---
title: Portfolio
description: This is my portfolio :)
---

## [myChattanooga News](https://mychattanooga.news)

Built in 2020, refactored each year since

- React and Next.js
- Typescript
- Playwright
- Vercel
- Supabase
- Postgres
- Prisma
- Docker

Greater Chattanooga-area news aggregator. This project has been through many iterations, but it current has two main parts, the hub and the scraper factory. The hub is a frontend interface built with Next.js that also includes an api route for server-side article fetching. The scraper factory is a large scale script that gathers news from all sources in parallel, and each individual news site's scraper is built with a combination of playwright and rss feed parsing. Article information is saved to Postgres is the given article is deemed to be relevant to those living in Chattanooga. Scrapers are run every 15 minutes via a cron job to ensure the site stays up to date with the newest articles from around town.

## [Syncwav](https://drive.proton.me/urls/SDX9K8CJYC#ozzZ7FZdtE0f)

Built in 2022, currently being refactored

- Python
- Pytorch
- ffmpeg

Generative adversarial neural network-based music visualization service. This project was inspired by the old Windows Media Player visualizer. I wanted to build something similar while also learning to build a generative adversarial neural network. The network was trained on images from NASA's James Webb and Hubble space telescopes, mostly galaxies and other large scale structures. 16-bit, 44.1Khz sample rate stereo wav files were averaged to mono and then split up into chunks to make 12 output png frames per second of audio (3,675 samples per video frame). Once the output process was completed, the frames were stitched together with ffmpeg with added motion interpolation to produce a smooth video file. Output video files were very low resolution, so Topaz Video AI was used to upscale and stabilize the videos.

I'm currently refactoring this project to leverage fast fourier transform frequency data to better visualize input wav files based on stereo frequency and amplitude data rather than just mono amplitude data alone.

## [Staley NFL Game Prediction Neural Network](https://github.com/rjb-tech/Staley-NFL-Prediction-Model)

Originally built in 2020, refactored in 2021 and 2022

- Python
- Pytorch
- R

This neural network was built with Pytorch and trained on custom data points (EPA per rush and pass play, first down rate, explosive play rate, etc.) for both the away and home team's offense and defense. I used a rolling average of 4 weeks during the season to best represent each team's most recent on-field play for predictions. Along with this I employed 5 versions of the model and forwarded the data through each to try and create a more accurate prediction. Version 1 only predicted a given game's winner and versions 2 and 3 predicted score as well as the game winner. The data was compiled in R then passed to a python script using the reticulate R package.

## [Streamthing](https://drive.proton.me/urls/NYJY44NBF4#T1hokRFUH0vp)

Built in late 2022/early 2023

- React and Next.js
- Typescript
- Tailwind CSS
- Supabase
- Postgres
- Google Youtube API

StreamThing is a social streaming network that aims to bring the easy decision-making of cable tv network guides to the streaming era. The app allows users to add up to 25 of their favorite Youtube channels as content sources with two playback modes. The standard playback mode shuffles videos from one random content source that is changed every hour, and the shuffle playback mode continuously plays a videos from any random content source added to a given user's network. Along with the user system was a friend system, allowing you to both share your personal network and view those created by your added friends. Check out the demo video linked in the header.

## Hideout

Built in 2025

- Astro
- React
- Typescript
- A synthesizer

This website. Just a cool little spot with a synthesizer built into the home page.
