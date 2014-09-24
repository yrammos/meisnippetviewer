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
  'vexflow',
  'mei2vf/core/Logger'
], function (VF, Logger, undefined) {
  /**
   * @exports areas/AreaHelper
   */

  var AreaHelper = function (viewer) {
    this.viewer = viewer;
  };

  AreaHelper.prototype = {

    setAreas : function (meiDoc, layers) {

      var me = this, i, j, k, areas, areaCollection;

      me.measureAreas = [];
      //      me.layerAreas = [];
      me.barlineAreas = [];
      me.measureModifierAreas = [];
      me.noteAreas = [];
      me.variantAreas = [];
      me.anchoredTextAreas = [];
      me.pgHeadAreas = [];

      var hTypes = {
        measures : [],
        //        layers:[],
        variants : [],
        notes : [],
        barlines : [],
        measure_modifiers : [],
        anchoredTexts : [],
        pgHead : []
      };

      var hType;

      i = layers.length;
      while (i--) {
        areaCollection = layers[i];
        if (areaCollection.type === 'highlighter') {
          j = areaCollection.content.length;
          while (j--) {
            hType = hTypes[areaCollection.content[j]];
            if (hType) {
              hType.push(areaCollection);
            } else {
              Logger.warn('Configuration error', 'Unknown area type "' + areaCollection.content[j] + '".');
            }
          }
        }
      }

      i = hTypes['measures'].length;
      j = hTypes['barlines'].length;
      k = hTypes['measure_modifiers'].length;
      if (i > 0 || j > 0 || k > 0) {
        me.calculateMeasureAreas(me.viewer.converter.getSystems());
        while (i--) {
          hTypes['measures'][i].addAreas(me.measureAreas);
        }
        while (j--) {
          hTypes['barlines'][j].addAreas(me.barlineAreas);
        }
        while (k--) {
          hTypes['measure_modifiers'][k].addAreas(me.measureModifierAreas);
        }
      }

      i = hTypes['notes'].length;
      if (i > 0) {
        me.calculateNoteAreas(me.viewer.converter.getNotes());
        while (i--) {
          hTypes['notes'][i].addAreas(me.noteAreas);
        }
      }

      i = hTypes['anchoredTexts'].length;
      if (i > 0) {
        me.calculateAnchoredTextAreas(me.viewer.anchoredTexts.getAll());
        while (i--) {
          hTypes['anchoredTexts'][i].addAreas(me.anchoredTextAreas);
        }
      }

      i = hTypes['pgHead'].length;
      if (i > 0 && me.viewer.pgHead) {
        me.calculatePgHeadAreas(me.viewer.pgHead.getTextsByLine());
        while (i--) {
          hTypes['pgHead'][i].addAreas(me.pgHeadAreas);
        }
      }

      i = hTypes['variants'].length;
      if (i > 0) {
        me.getVariantCoordinates(meiDoc);
        while (i--) {
          hTypes['variants'][i].addAreas(me.variantAreas);
        }
      }

      i = layers.length;
      while (i--) {
        if (layers[i].type === 'highlighter') {
          layers[i].initHighlights();
        }
      }

    },

    calculateMeasureAreas : function (systems) {
      var me = this, i, j, k, l, m, n, stave, x, y, w, y1, measures, staves;
      var STAFF_BOTTOM_OFFSET = 20;


      for (i = 0, j = systems.length; i < j; i += 1) {
        if (systems[i]) {
          measures = systems[i].getMeasures();
          for (k = 0, l = measures.length; k < l; k += 1) {
            staves = measures[k].getStaves();
            for (m = 0, n = staves.length; m < n; m++) {
              stave = staves[m];
              if (stave) {
                x = stave.x;
                y = stave.y;
                w = stave.width;
                y1 = stave.getBottomY() - STAFF_BOTTOM_OFFSET;
                me.measureAreas.push({
                  ctx : {
                    x : x,
                    y : y,
                    w : w,
                    h : y1 - y,
                    x1 : x + w,
                    y1 : y1
                  },
                  measureN : measures[k].n,
                  staveN : m
                });

                var staveY = stave.getYForLine(0) - 5;
                var staveH = stave.getYForLine(4) - staveY + 10;
                me.calculateBarlineAreas(stave, staveY, staveH, measures[k].getMeiElement());
                me.calculateStaveModifierAreas(stave, staveY, staveH);
              }
            }
          }
        }
      }
    },

    calculateBarlineAreas : function (stave, staveY, staveH, meiElement) {
      var me = this;

      if (stave.modifiers[0].barline !== 7) {
        me.barlineAreas.push(me.createNoteAreaObj('barline', stave.modifiers[0].x - 8, staveY, 16, staveH, meiElement, 1));
      }
      if (stave.modifiers[1].barline !== 7) {
        me.barlineAreas.push(me.createNoteAreaObj('barline', stave.modifiers[1].x - 8, staveY, 16, staveH, meiElement, 1));
      }
    },

    calculateStaveModifierAreas : function (stave, y, h) {
      var me = this, modifiers = stave.modifiers, i, j, category, x, w;
      j = stave.glyphs.length;
      x = stave.getGlyphStartX();
      var glyph, glyphXW = [], glyphXWindex = 0;

      var codes = {
        v18 : 'meiKeySpecElement',
        v44 : 'meiKeySpecElement',
        v83 : 'meiClefElement',
        v79 : 'meiClefElement',
        vad : 'meiClefElement',
        v59 : 'meiClefElement',
        v8 : 'meiClefElement'
      };

      for (var i = 0; i < j; i++) {
        glyph = stave.glyphs[i];
        w = glyph.getMetrics().width;
        if (glyph.code) {
          me.measureModifierAreas.push(me.createNoteAreaObj('stave-modifier', x, y - 15, w, h + 30, stave[codes[glyph.code] ||
                                                                                        'meiTimeSpecElement'], i));
        }
        x += w;
      }

      j = stave.end_glyphs.length;
      x = stave.getGlyphEndX();
      var glyph;
      for (var i = 0; i < j; i++) {
        glyph = stave.end_glyphs[i];
        if (glyph.code) {
          w = glyph.getMetrics().width;
          x -= w;
          me.measureModifierAreas.push(me.createNoteAreaObj('stave-modifier', x, y - 15, w, h + 30, stave.meiEndClefElement, i));
        }
      }
    },

    calculateNoteAreas : function (notes) {
      var me = this, i, j, k, l, note, box, x, y, w, h, metrics, meiElement;
      for (i in notes) {
        note = notes[i].vexNote;
        meiElement = notes[i].meiNote;
        box = note.getBoundingBox();
        x = note.getAbsoluteX() - 10;
        y = box.y - 10;
        w = 30;
        h = box.h + 20;
        me.noteAreas.push(me.createNoteAreaObj('note', x, y, w, h, meiElement, i));
        me.calculateNoteModifierAreas(note);
      }
    },

    createNoteAreaObj : function (type, x, y, w, h, meiElement, xmlid) {
      return {
        type : type,
        ctx : {
          x : x,
          y : y,
          w : w,
          h : h,
          x1 : x + w,
          y1 : y + h
        },
        meiElement : meiElement,
        xmlid : xmlid
      };
    },

    calculateAnchoredTextAreas : function (texts) {
      var me = this;
      i = texts.length;
      while (i--) {
        me.anchoredTextAreas.push(texts[i].getArea());
      }
    },

    calculatePgHeadAreas : function (textsByLine) {
      var me = this, i, j, texts;
      j = textsByLine.length;
      while (j--) {
        texts = textsByLine[j];
        i = texts.length;
        while (i--) {
          me.pgHeadAreas.push(texts[i].getArea());
        }
      }
    },

    calculateNoteModifierAreas : function (note) {
      var me = this, modifiers = note.modifiers, i, category, x, y, w, h, areas = [];
      i = modifiers.length;
      while (i--) {
        category = modifiers[i].getCategory();
        switch (category) {
          case 'annotations':
            x = modifiers[i].x - 6;
            y = modifiers[i].y - 20;
            w = modifiers[i].text_width + 12;
            h = 30;
            me.noteAreas.push(me.createNoteAreaObj('note-modifier', x, y, w, h, modifiers[i].getMeiElement(), i));
            break;
          case 'articulations':
            w = modifiers[i].width + 8;
            h = w;
            x = modifiers[i].x - w / 2 - modifiers[i].articulation.shift_right;
            y = modifiers[i].y - h / 2 - modifiers[i].articulation.shift_down;
            me.noteAreas.push(me.createNoteAreaObj('note-modifier', x, y, w, h, modifiers[i].getMeiElement(), i));
            break;
          case 'dots':
          case 'accidentals':
          default:
            // console.log('not processed: ' + category);
            break;
        }
      }
    },

    calculateNoteModifierArea : function () {

    },

    calculateNoteArea : function (notes, xmlid) {
      var me = this, i, j, k, l, note, box, x, y, w, h;

      note = notes[xmlid].vexNote;
      box = note.getBoundingBox();

      x = note.getAbsoluteX() - 10;
      y = box.y - 10;
      w = 30;
      h = box.h + 20;
      return {
        ctx : {
          x : x,
          y : y,
          w : w,
          h : h,
          x1 : x + w,
          y1 : y + h
        },
        xmlid : xmlid
      };
    },

    /**
     * Calculates an area which contains all of the specified areas.
     * @param {Object[]} areas
     * @returns {{ctx: {x: number, y: number, x1: number, y1: number}, xmlids: Array}}
     */
    getSurroundingArea : function (areas) {
      var i = areas.length, ctx, xmlids = [];
      ctx = {
        x : 10000,
        y : 10000,
        x1 : 0,
        y1 : 0
      };
      while (i--) {
        xmlids.push(areas[i].xmlid);
        ctx.x = Math.min(ctx.x, areas[i].ctx.x);
        ctx.y = Math.min(ctx.y, areas[i].ctx.y);
        ctx.x1 = Math.max(ctx.x1, areas[i].ctx.x1);
        ctx.y1 = Math.max(ctx.y1, areas[i].ctx.y1);
      }
      ctx.w = ctx.x1 - ctx.x;
      ctx.h = ctx.y1 - ctx.y;
      return {
        ctx : ctx,
        xmlids : xmlids
      }
    },

    getVariantCoordinates : function (meiDoc) {
      var me = this, i, j, appObject, idsInAlternative, area, areas, surroundingArea;

      // loop through all meilib app objects
      for (i in meiDoc.ALTs) {
        appObject = meiDoc.ALTs[i];
        idsInAlternative = me.getIdsInAlternative(meiDoc, appObject);
        areas = [];
        for (j in idsInAlternative) {
          area = me.getIdCoordinates(j, idsInAlternative[j]);
          if (area) {
            area.alt = appObject;
            //            areas.push(area);

            me.variantAreas.push(area);
          }
        }
        //        surroundingArea = me.getSurroundingArea(areas);
        //        surroundingArea.alt = appObject;
        //        me.variantAreas.push(surroundingArea);
      }
    },


    getIdsInAlternative : function (meiDoc, appObject, selectedSource) {
      var i, j, selectedAlternElement, id, descendantIds = {}, defaultAltern;

      defaultAltern = appObject.getDefaultItem();

      if (defaultAltern) {
        // if specified, select the default alternative ...
        selectedAlternElement = defaultAltern.elem;
      }

      var descendantElements = selectedAlternElement.getElementsByTagName('*');
      for (i = 0, j = descendantElements.length; i < j; i += 1) {
        id = descendantElements[i].getAttribute('xml:id');
        if (id) {
          descendantIds[id] = descendantElements[i].localName;
        }
      }
      return descendantIds;
    },


    getIdCoordinates : function (xmlid, localName) {
      var me = this, area;
      switch (localName) {
        case 'note':
          return me.calculateNoteArea(me.viewer.converter.getNotes(), xmlid);
        case 'rest':
          return me.calculateNoteArea(me.viewer.converter.getNotes(), xmlid);
        case 'mRest':
          return me.calculateNoteArea(me.viewer.converter.getNotes(), xmlid);
        case 'syl':

        default:
          return;
      }
    }
  };

  return AreaHelper;

});
