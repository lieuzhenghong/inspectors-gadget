# Inspector's Gadget

## Introduction

Inspector's Gadget is a desktop GUI application that streamlines the process of
generating building inspection reports.

A building inspection report involves three things:

1. Photos taken of the building
2. Floor plan of the building
3. PDF report of all building defects and recommended actions taken (if any)

A building inspection report is done as follows: the engineer walks around the
building and takes photos of all structural features and defects (if any).

The engineer will then annotate the floor plan, showing where the defects are
in the building. Here's what that looks like:

The final report includes the annotated floor plan, the table of captioned
photos and final recommendations by the engineer.

Generating this final report manually is a very time-consuming process and this
application streamlines the process by 75%.

## Feature showcase

### Upload floor plan 

<img
src="https://thumbs.gfycat.com/ComposedGregariousCapybara-size_restricted.gif"
width="100%">

### Upload photos and tag floor plan

<img
src="https://thumbs.gfycat.com/DeadDependableBluebottle-size_restricted.gif">

The smart tagging feature shows you a preview of the photo while
you're tagging it so you don't need to switch windows.

### Move tag position
<img
src="https://thumbs.gfycat.com/BackUnevenIberianemeraldlizard-size_restricted.gif">

If you have made a mistake in placing a tag, simply right-click to
reposition the tag.

### Comment on building defects
<img
src="
https://thumbs.gfycat.com/WiltedAdolescentIraniangroundjay-size_restricted.gif">

Annotate building photos within the application itself.

### Save and load floor plans
<img
src="
https://thumbs.gfycat.com/FarflungPastelKinglet-size_restricted.gif">

You can work on mutiple projects at once and even have multiple versions of the
same project.

### Exported report
<img src="/docs/img/report.png">

The final product: an automatically-generated building inspection report.

## Getting started

### Windows

Download Inspector's Gadget from the [releases page](https://github.com/lieuzhenghong/inspectors-gadget/releases) and run `inspectors-gadget.exe`.

### All other OSes

```bash
git clone "https://github.com/lieuzhenghong/inspectors-gadget"
cd inspectors-gadget
npm run start
```

## Real-world usage results

Given by the client for the period August–September 2017

> - Reports generated : 340
> - Hours taken to generate report without software: 4x340 
> - Hours taken to generate report with software: 1x340
> - Man-hours saved: **1020** (3x340)

> Intangible benefits: 
>  1) Improved quality of work
>  2) More focus on defect observed
>  3) More time spent on recommendation
>  4) Overall improvement of 85% on cycle time per report                        
>  5) Easy summary of common defects
>  6) Easy access to information for analysis and conclusion
>  7) Report format easier for [professional engineer's] to do final review and
>     approval for submission.

[![Build Status](https://travis-ci.org/lieuzhenghong/inspectors-gadget.svg?branch=master)](https://travis-ci.org/lieuzhenghong/inspectors-gadget)
