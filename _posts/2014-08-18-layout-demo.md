---
layout: demopage
title: "Layout Demo"
category: demo
date: 2014-08-18 06:24:45
---

Also see the [Layout documentation]({{ site.baseurl }}{% post_url 2014-08-17-layout %}).

<div class="well">
<p>This page demonstrates embedding of short music fragments in a text. Layout is specified with simple inline CSS rules.
</p>
<p>
Each of the music fragments on the page consists of three canvas layers: one contains the VexFlow output (the notated music), the others 
are used to highlight overlapping score features (layer 1: measures, layer 2: notes, bar lines, clefs etc.) 
</p>
</div>

<h3>Separate Lines</h3>

<div>
    <p class="lorem"></p>
</div>
<div style="text-align:center;">
    <span class="music"></span>
</div>
<div>
    <p class="lorem"></p>
</div>
<div style="text-align:left;">
    <span class="music"></span>
</div>
<div>
    <p class="lorem"></p>
</div>
<div style="text-align:right;">
    <span class="music"></span>
</div>
<h3>Inline</h3>

<div>
    <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua.
        <span class="music" style="display:inline-table;vertical-align:middle"></span><b>(vertical-align:middle)</b> At
        vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
        tempor invidunt ut labor.
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua.
        <span class="music" style="display:inline-table;vertical-align:top"></span><b>(vertical-align:top)</b> At vero
        eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
        invidunt ut labor.
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua.
        <span class="music" style="display:inline-table;vertical-align:bottom"></span><b>(vertical-align:bottom)</b> At
        vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
        tempor invidunt ut labor.
    </p>
</div>
<h3>Table</h3>
<table>
    <tbody>
    <tr>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
        <td style="text-align:center;">
            <span class="music"></span>
            <p>center</p>
        </td>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
    </tr>
    <tr>
        <td style="text-align:left;">
            <p>left</p>
            <div class="music"></div>
        </td>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
    </tr>
    <tr>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
        <td>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </td>
        <td style="text-align:right;">
            <span class="music"></span>
            <p>right</span>
        </td>
    </tr>
    </tbody>
</table>
<h3>Float</h3>

<div>
    <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua.
        <span class="music" style="float:right;"></span>At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
        consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labor.
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua.
        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
        tempor invidunt ut labor.
        <span class="music" style="float:left;"></span>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
        tempor invidunt ut labor.
    </p>
</div>

<script type="text/JavaScript" src="{{ site.baseurl }}/js/layout-demo.js"></script>