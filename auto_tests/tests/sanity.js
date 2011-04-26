// Copyright (c)  2011 Google, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


/** 
 * @fileoverview Test cases that ensure Dygraphs works at all.
 *
 * @author konigsberg@google.com (Robert Konigsberg)
 */
var DEAD_SIMPLE_DATA = [[ 20061010, 2100 ]];
var ZERO_TO_FIFTY = [[ 20061010, 0 ] , [ 20061011, 50 ]];

var SanityTestCase = TestCase("dygraphs-sanity");

SanityTestCase.prototype.setUp = function() {
  document.body.innerHTML = "<div id='graph'></div>";
};

/**
 * The sanity test of sanity tests.
 */
SanityTestCase.prototype.testTrue = function() {
  assertTrue(true);
};

/**
 * Sanity test that ensures the graph element exists.
 */
SanityTestCase.prototype.testGraphExists = function() {
  var graph = document.getElementById("graph");
  assertNotNull(graph);
};

/**
 * A sanity test of sorts, by ensuring the dygraph is created, and
 * isn't just some piece of junk object.
 */
SanityTestCase.prototype.testToString = function() {
  var graph = document.getElementById("graph");
  var g = new Dygraph(graph, DEAD_SIMPLE_DATA, {});
  assertNotNull(g);
  assertEquals("[Dygraph graph]", g.toString());
};

/**
 * Test that when no valueRange is specified, the y axis range is
 * adjusted by 10% on top.
 */
SanityTestCase.prototype.testYAxisRange_default = function() {
  var graph = document.getElementById("graph");
  assertEquals(0, graph.style.length);
  var g = new Dygraph(graph, ZERO_TO_FIFTY, {});
  assertEquals([0, 55], g.yAxisRange(0));
};

/**
 * Test that valueRange matches the y-axis range specifically.
 */
SanityTestCase.prototype.testYAxisRange_custom = function() {
  var graph = document.getElementById("graph");
  var g = new Dygraph(graph, ZERO_TO_FIFTY, { valueRange: [0,50] });
  assertEquals([0, 50], g.yAxisRange(0));
};

function assertEqualsDelta(msg, expected, actual, delta) {
  var args = this.argsWithOptionalMsg_(arguments, 4);

  var message = args[0];
  var exp = args[1];
  var act = args[2];
  var d = args[3];
  if (Math.abs(exp - act) > d) {
    fail(message +
        " Expected to be within " + d + " of " + exp + ", got " + act);
  }
}

/**
 * Test that valueRange matches the y-axis range specifically.
 *
 * This is based on the assumption that 20 pixels are dedicated to the
 * axis label and tick marks.
 * TODO(konigsberg): change yAxisLabelWidth to 0 (or 20) and try again.
 */
SanityTestCase.prototype.testToDomYCoord = function() {
  var graph = document.getElementById("graph");
  var g = new Dygraph(graph, ZERO_TO_FIFTY, { height: 70, valueRange: [0,50] });

  assertEquals(50, g.toDomYCoord(0));
  assertEquals(0, g.toDomYCoord(50));
  
  for (var x = 0; x <= 50; x++) {
    assertEqualsDelta(50 - x, g.toDomYCoord(x), 0.00001);
  }
};