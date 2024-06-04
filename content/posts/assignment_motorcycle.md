+++
author = "Ding Ding"
title = "A glimpse into the world of motorcycles"
date = "2024-06-03"
description = " animation is on the way"
tags = [
    "visualization",
]
keywords = "data visualization, animation"
draft = false
includeToc = true
localCss = []
externalCss = []
externalCssDownload = []
localJs = []
externalJs = []
externalJsDownload = []
useMath = false
+++


# A glimpse into the world of motorcycles

> ### University Of Waikato
> 
> #### COMPX532
> Convenor: [Prof Mark Apperley](https://profiles.waikato.ac.nz/mark.apperley)
> 

> #### Jiahui Ding's project of assignemnt 5

## 1. Introduction

Different from the tool attributes of four-wheeled vehicles, two-wheeled motorcycles (of course there are some three-wheeled heretics) provide a different lifestyle, allowing us to have a unique experience of wind and freedom.
As the final project of COMPX532 course, I tried to combine the course and hobbies. Just like bragging about my hobbies to my friends, I hope that this project can bring a preliminary perceptual understanding of the world of motorcycles.

Inspired by the previous Visualisation Toolkits Lecture, I used d3.js as the implementation method in this project. Compared with python or other implementation methods, the d3 based on web drawing has better performance.
Like plotly express based on python, I also deployed it on my personal github page (https://orphea-dd.github.io/orphea-dd/posts/assignment_motorcycle/).

## 2. Project Design

First I collected the common models in the NZ motorcycle market. To accommodate the large amount of data, I organized it into a scalable tree diagram.

[NZ motor market](./NZ-motor-market/index.html)

I then compiled the sales of NZ motorcycles over the past three years, and a zoomable pie chart was created to show New Zealanders’ preference for motorcycle brands and models.

[New Zealand Motorcycle Sales](./New-Zealand-Motorcycle-Sales/index.html)

Finally, I made an animated bar chart of the results of MotoGP, one of the top motorcycle events, since 2003, which not only introduces the level of the drivers but also reflects the level of the motorcycle manufacturers to a certain extent.

[MotoGP Ranking](./MotoGP-Ranking/index.html)

## 3. Data Source

[1]. MotoGP Official Website <https://www.motogp.com/en/world-standing>

[2]. The Motor Industry Association of New Zealand (Inc) <https://www.mia.org.nz/>
