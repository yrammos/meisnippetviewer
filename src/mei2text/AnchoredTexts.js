/*
 * (C) Copyright 2014 Alexander Erhard (http://alexandererhard.com/).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
define([
  'jquery',
  'vexflow',
  'meitovexflow',
  'mei2text/Text'
], function ($, VF, m2v, Text, undefined) {
  /**
   * @exports mei2text/AnchoredTexts
   */

  /**
   * @class MEI2TEXT.AnchoredTexts
   * @private
   *
   * @constructor
   */
  var AnchoredTexts = function (font) {
    var me = this;

    me.font = font;

    me.allTexts = [];
  };

  AnchoredTexts.prototype = {

    getAll : function () {
      return this.allTexts;
    },

    /**
     * Creates a model object from an element and adds it to {@link #allTexts}
     * @param {Element} element
     */
    addText : function (element) {
      var me = this;
      me.allTexts.push(new Text(element, {
        fontfamily : me.font.family,
        fontweight : me.font.weight,
        fontsize : me.font.size,
        fontstyle : ''
      }));
    },

    /**
     * Gets an element's first ancestor with the specified localName
     * @param {Element} element the start element
     * @param {String} localName the localName of the ancestor
     * @returns {Element}
     */
    getAncestor : function (element, localName) {
      while (( element = element.parentElement) && (element.localName !== localName)) {}
      return element;
    },

    // TODO better get container elements by id!?!?
    getContainer : function (element, allVexMeasureStaffs) {
      var me = this, staff, measure, measure_n, staff_n;
      staff = me.getAncestor(element, 'staff');
      if (staff) {
        measure = me.getAncestor(staff, 'measure');
        if (measure) {
          measure_n = measure.getAttribute('n') || '1';
          staff_n = staff.getAttribute('n') || '1';
          return allVexMeasureStaffs[measure_n][staff_n];
        }
      }
      return null;
    },

    setContext : function (ctx) {
      this.ctx = ctx;
      return this;
    },

    draw : function (allVexMeasureStaffs) {
      var me = this, x, y, staff, ctx = me.ctx;
      $.each(me.allTexts, function () {

        if (!this.y) {
          staff = me.getContainer(this.meiElement, allVexMeasureStaffs);
          this.setY(staff.getYForLine(3) - 4 + (+this.atts.vo * staff.getSpacingBetweenLines() / 2 || 0));
        }
        if (!this.x) {
          if (!staff) {
            staff = me.getContainer(this.meiElement, allVexMeasureStaffs);
          }
          this.setX(staff.getGlyphStartX() + (+this.atts.ho * staff.getSpacingBetweenLines() / 2 || 0));
        }

        this.setContext(ctx).preProcess().draw();

      });
    }
  };

  return AnchoredTexts;

});