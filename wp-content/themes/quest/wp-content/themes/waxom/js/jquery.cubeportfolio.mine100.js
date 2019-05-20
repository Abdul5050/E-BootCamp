/*!
 * Cube Portfolio - Responsive jQuery Grid Plugin
 *
 * version: 3.2.1 (9 October, 2015)
 * require: jQuery v1.7+
 *
 * Copyright 2013-2015, Mihai Buricea (http://scriptpie.com/cubeportfolio/live-preview/)
 * Licensed under CodeCanyon License (http://codecanyon.net/licenses)
 *
 */
! function(a, b, c, d) {
    "use strict";

    function e(b, c, d) {
        var f, g = this,
            h = "cbp";
        if (a.data(b, "cubeportfolio")) throw new Error("cubeportfolio is already initialized. Destroy it before initialize again!");
        a.data(b, "cubeportfolio", g), g.options = a.extend({}, a.fn.cubeportfolio.options, c), g.isAnimating = !0, g.defaultFilter = g.options.defaultFilter, g.registeredEvents = [], g.queue = [], g.addedWrapp = !1, a.isFunction(d) && g.registerEvent("initFinish", d, !0), g.obj = b, g.$obj = a(b), f = g.$obj.children(), g.options.caption && ("expand" === g.options.caption || e.Private.modernBrowser || (g.options.caption = "minimal"), h += " cbp-caption-active cbp-caption-" + g.options.caption), g.$obj.addClass(h), (0 === f.length || f.first().hasClass("cbp-item")) && (g.wrapInner(g.obj, "cbp-wrapper"), g.addedWrapp = !0), g.$ul = g.$obj.children().addClass("cbp-wrapper"), g.wrapInner(g.obj, "cbp-wrapper-outer"), g.wrapper = g.$obj.children(".cbp-wrapper-outer"), g.blocks = g.$ul.children(".cbp-item"), g.blocksOn = g.blocks, g.wrapInner(g.blocks, "cbp-item-wrapper"), g.plugins = a.map(e.Plugins, function(a) {
            return a(g)
        }), g.loadImages(g.$obj, g.display)
    }
    a.extend(e.prototype, {
        storeData: function(b, c) {
            var d = this;
            c = c || 0, b.each(function(b, e) {
                var f = a(e),
                    g = f.width(),
                    h = f.height();
                f.data("cbp", {
                    index: c + b,
                    wrapper: f.children(".cbp-item-wrapper"),
                    widthInitial: g,
                    heightInitial: h,
                    width: g,
                    height: h,
                    widthAndGap: g + d.options.gapVertical,
                    heightAndGap: h + d.options.gapHorizontal,
                    left: null,
                    leftNew: null,
                    top: null,
                    topNew: null,
                    pack: !1
                })
            })
        },
        wrapInner: function(a, b) {
            var e, f, g;
            if (b = b || "", !(a.length && a.length < 1))
                for (a.length === d && (a = [a]), f = a.length - 1; f >= 0; f--) {
                    for (e = a[f], g = c.createElement("div"), g.setAttribute("class", b); e.childNodes.length;) g.appendChild(e.childNodes[0]);
                    e.appendChild(g)
                }
        },
        loadImages: function(b, c) {
            var d = this;
            requestAnimationFrame(function() {
                var e = b.find("img").map(function(a, b) {
                        return d.checkSrc(b.src)
                    }),
                    f = e.length;
                0 === f && c.call(d), a.each(e, function(a, b) {
                    b.one("load.cbp error.cbp", function() {
                        f--, 0 === f && c.call(d)
                    })
                })
            })
        },
        checkSrc: function(b) {
            if ("" === b) return null;
            var c = new Image;
            return c.src = b, c.complete && c.naturalWidth !== d && 0 !== c.naturalWidth ? null : a(c)
        },
        display: function() {
            var a = this;
            a.width = a.$obj.outerWidth(), a.storeData(a.blocks), a.filterFromUrl(), a.triggerEvent("initStartRead"), a.triggerEvent("initStartWrite"), "slider" === a.options.layoutMode && a.registerEvent("gridAdjust", function() {
                a.sliderMarkup()
            }, !0), a.layoutAndAdjustment(), a.triggerEvent("initEndRead"), a.triggerEvent("initEndWrite"), a.$obj.addClass("cbp-ready"), a.runQueue("delayFrame", a.delayFrame)
        },
        delayFrame: function() {
            var a = this;
            requestAnimationFrame(function() {
                a.resizeEvent(), a.triggerEvent("initFinish"), a.isAnimating = !1, a.$obj.trigger("initComplete.cbp")
            })
        },
        resizeEvent: function() {
            var a, b = this;
            e.Private.initResizeEvent({
                instance: b,
                fn: function() {
                    var b = this;
                    b.triggerEvent("beforeResizeGrid"), a = b.$obj.outerWidth(), b.width !== a && ("alignCenter" === b.options.gridAdjustment && (b.wrapper[0].style.maxWidth = ""), b.width = a, b.layoutAndAdjustment(), "slider" === b.options.layoutMode && b.updateSlider(), b.triggerEvent("resizeGrid")), b.triggerEvent("resizeWindow")
                }
            })
        },
        gridAdjust: function() {
            var b = this;
            "responsive" === b.options.gridAdjustment ? b.responsiveLayout() : (b.blocks.removeAttr("style"), b.blocks.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = d.getBoundingClientRect(),
                    g = b.columnWidthTruncate(f.right - f.left),
                    h = Math.round(f.bottom - f.top);
                e.height = h, e.heightAndGap = h + b.options.gapHorizontal, e.width = g, e.widthAndGap = g + b.options.gapVertical
            }), b.widthAvailable = b.width + b.options.gapVertical), b.triggerEvent("gridAdjust")
        },
        layoutAndAdjustment: function() {
            var a = this;
            a.gridAdjust(), a.layout()
        },
        layout: function() {
            var a = this;
            a.computeBlocks(a.filterConcat(a.defaultFilter)), "slider" === a.options.layoutMode ? (a.sliderLayoutReset(), a.sliderLayout()) : (a.mosaicLayoutReset(), a.mosaicLayout()), a.positionateItems(), a.resizeMainContainer()
        },
        computeFilter: function(a) {
            var b = this;
            b.computeBlocks(a), b.mosaicLayoutReset(), b.mosaicLayout(), b.filterLayout()
        },
        filterLayout: function() {
            var b = this;
            b.blocksOff.addClass("cbp-item-off"), b.blocksOn.removeClass("cbp-item-off").each(function(b, c) {
                var d = a(c).data("cbp");
                d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px"
            }), b.resizeMainContainer(), b.filterFinish()
        },
        filterFinish: function() {
            var a = this;
            a.blocksAreSorted && a.sortBlocks(a.blocks, "index"), a.isAnimating = !1, a.$obj.trigger("filterComplete.cbp"), a.triggerEvent("filterFinish")
        },
        computeBlocks: function(a) {
            var b = this;
            b.blocksOnInitial = b.blocksOn, b.blocksOn = b.blocks.filter(a), b.blocksOff = b.blocks.not(a), b.triggerEvent("computeBlocksFinish", a)
        },
        responsiveLayout: function() {
            var b = this;
            b.cols = b[a.isArray(b.options.mediaQueries) ? "getColumnsBreakpoints" : "getColumnsAuto"](), b.columnWidth = b.columnWidthTruncate((b.width + b.options.gapVertical) / b.cols), b.widthAvailable = b.columnWidth * b.cols, "mosaic" === b.options.layoutMode && b.getMosaicWidthReference(), b.blocks.each(function(c, d) {
                var e, f = a(d).data("cbp"),
                    g = 1;
                "mosaic" === b.options.layoutMode && (g = b.getColsMosaic(f.widthInitial)), e = b.columnWidth * g - b.options.gapVertical, d.style.width = e + "px", f.width = e, f.widthAndGap = e + b.options.gapVertical, d.style.height = ""
            }), b.blocks.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = d.getBoundingClientRect(),
                    g = Math.round(f.bottom - f.top);
                e.height = g, e.heightAndGap = g + b.options.gapHorizontal
            })
        },
        getMosaicWidthReference: function() {
            var b = this,
                c = [];
            b.blocks.each(function(b, d) {
                var e = a(d).data("cbp");
                c.push(e.widthInitial)
            }), c.sort(function(a, b) {
                return a - b
            }), b.mosaicWidthReference = c[0] ? c[0] : b.columnWidth
        },
        getColsMosaic: function(a) {
            var b = this;
            if (a === b.width) return b.cols;
            var c = a / b.mosaicWidthReference;
            return c = c % 1 >= .79 ? Math.ceil(c) : Math.floor(c), Math.min(Math.max(c, 1), b.cols)
        },
        getColumnsAuto: function() {
            var a = this;
            if (0 === a.blocks.length) return 1;
            var b = a.blocks.first().data("cbp").widthInitial + a.options.gapVertical;
            return Math.max(Math.round(a.width / b), 1)
        },
        getColumnsBreakpoints: function() {
            var b, c = this,
                e = c.width;
            return a.each(c.options.mediaQueries, function(a, c) {
                return e >= c.width ? (b = c.cols, !1) : void 0
            }), b === d && (b = c.options.mediaQueries[c.options.mediaQueries.length - 1].cols), b
        },
        columnWidthTruncate: function(a) {
            return Math.floor(a)
        },
        positionateItems: function() {
            var b, c = this;
            c.blocksOn.removeClass("cbp-item-off").each(function(c, d) {
                b = a(d).data("cbp"), b.left = b.leftNew, b.top = b.topNew, d.style.left = b.left + "px", d.style.top = b.top + "px"
            }), c.blocksOff.addClass("cbp-item-off"), c.blocksAreSorted && c.sortBlocks(c.blocks, "index")
        },
        resizeMainContainer: function() {
            var b, c = this,
                f = Math.max(c.freeSpaces.slice(-1)[0].topStart - c.options.gapHorizontal, 0);
            "alignCenter" === c.options.gridAdjustment && (b = 0, c.blocksOn.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = e.left + e.width;
                f > b && (b = f)
            }), c.wrapper[0].style.maxWidth = b + "px"), f !== c.height && (c.obj.style.height = f + "px", c.height !== d && (e.Private.modernBrowser ? c.$obj.one(e.Private.transitionend, function() {
                c.$obj.trigger("pluginResize.cbp")
            }) : c.$obj.trigger("pluginResize.cbp")), c.height = f, c.triggerEvent("resizeMainContainer"))
        },
        filterFromUrl: function() {
            var a = this,
                b = /#cbpf=(.*?)([#\?&]|$)/gi.exec(location.href);
            null !== b && (a.defaultFilter = decodeURIComponent(b[1]))
        },
        filterConcat: function(a) {
            return a.replace(/\|/gi, "")
        },
        pushQueue: function(a, b) {
            var c = this;
            c.queue[a] = c.queue[a] || [], c.queue[a].push(b)
        },
        runQueue: function(b, c) {
            var d = this,
                e = d.queue[b] || [];
            a.when.apply(a, e).then(a.proxy(c, d))
        },
        clearQueue: function(a) {
            var b = this;
            b.queue[a] = []
        },
        registerEvent: function(a, b, c) {
            var d = this;
            d.registeredEvents[a] || (d.registeredEvents[a] = []), d.registeredEvents[a].push({
                func: b,
                oneTime: c || !1
            })
        },
        triggerEvent: function(a, b) {
            var c, d, e = this;
            if (e.registeredEvents[a])
                for (c = 0, d = e.registeredEvents[a].length; d > c; c++) e.registeredEvents[a][c].func.call(e, b), e.registeredEvents[a][c].oneTime && (e.registeredEvents[a].splice(c, 1), c--, d--)
        },
        addItems: function(b, c) {
            var d = this;
            d.wrapInner(b, "cbp-item-wrapper"), b.addClass("cbp-item-loading").css({
                top: "100%",
                left: 0
            }).appendTo(d.$ul), e.Private.modernBrowser ? b.last().one(e.Private.animationend, function() {
                d.addItemsFinish(b, c)
            }) : d.addItemsFinish(b, c), d.loadImages(b, function() {
                d.$obj.addClass("cbp-addItems"), d.storeData(b, d.blocks.length), a.merge(d.blocks, b), d.triggerEvent("addItemsToDOM", b), d.layoutAndAdjustment(), "slider" === d.options.layoutMode && d.updateSlider(), d.elems && e.Public.showCounter.call(d.obj, d.elems)
            })
        },
        addItemsFinish: function(b, c) {
            var d = this;
            d.isAnimating = !1, d.$obj.removeClass("cbp-addItems"), b.removeClass("cbp-item-loading"), a.isFunction(c) && c.call(d)
        }
    }), a.fn.cubeportfolio = function(a, b, c) {
        return this.each(function() {
            if ("object" == typeof a || !a) return e.Public.init.call(this, a, b);
            if (e.Public[a]) return e.Public[a].call(this, b, c);
            throw new Error("Method " + a + " does not exist on jquery.cubeportfolio.js")
        })
    }, e.Plugins = {}, a.fn.cubeportfolio.Constructor = e
}(jQuery, window, document),
function(a) {
    "use strict";

    function b(b) {
        var c = this;
        c.parent = b, c.filters = a(b.options.filters), c.filterData = [], c.registerFilter()
    }
    var c = a.fn.cubeportfolio.Constructor;
    b.prototype.registerFilter = function() {
        var b = this,
            c = b.parent,
            d = c.defaultFilter.split("|");
        b.wrap = b.filters.find(".cbp-l-filters-dropdownWrap").on({
            "mouseover.cbp": function() {
                a(this).addClass("cbp-l-filters-dropdownWrap-open")
            },
            "mouseleave.cbp": function() {
                a(this).removeClass("cbp-l-filters-dropdownWrap-open")
            }
        }), b.filters.each(function(e, f) {
            var g = a(f),
                h = "*",
                i = g.find(".cbp-filter-item"),
                j = {};
            g.hasClass("cbp-l-filters-dropdown") && (j.wrap = g.find(".cbp-l-filters-dropdownWrap"), j.header = g.find(".cbp-l-filters-dropdownHeader"), j.headerText = j.header.text()), c.$obj.cubeportfolio("showCounter", i), a.each(d, function(a, b) {
                return i.filter('[data-filter="' + b + '"]').length ? (h = b, d.splice(a, 1), !1) : void 0
            }), a.data(f, "filterName", h), b.filterData.push(f), b.filtersCallback(j, i.filter('[data-filter="' + h + '"]')), i.on("click.cbp", function() {
                var d = a(this);
                if (!d.hasClass("cbp-filter-item-active") && !c.isAnimating) {
                    b.filtersCallback(j, d), a.data(f, "filterName", d.data("filter"));
                    var e = a.map(b.filterData, function(b) {
                        var c = a.data(b, "filterName");
                        return "" !== c && "*" !== c ? c : null
                    });
                    e.length < 1 && (e = ["*"]);
                    var g = e.join("|");
                    c.defaultFilter !== g && c.$obj.cubeportfolio("filter", g)
                }
            })
        })
    }, b.prototype.filtersCallback = function(b, c) {
        a.isEmptyObject(b) || (b.wrap.trigger("mouseleave.cbp"), b.headerText ? b.headerText = "" : b.header.text(c.text())), c.addClass("cbp-filter-item-active").siblings().removeClass("cbp-filter-item-active")
    }, b.prototype.destroy = function() {
        var a = this;
        a.filters.find(".cbp-filter-item").off(".cbp"), a.wrap.off(".cbp")
    }, c.Plugins.Filters = function(a) {
        return "" === a.options.filters ? null : new b(a)
    }
}(jQuery, window, document),
function(a, b) {
    "use strict";

    function c(b) {
        var c = this;
        c.parent = b, c.loadMore = a(b.options.loadMore).find(".cbp-l-loadMore-link"), b.options.loadMoreAction.length && c[b.options.loadMoreAction]()
    }
    var d = a.fn.cubeportfolio.Constructor;
    c.prototype.click = function() {
        var b = this,
            c = 0;
        b.loadMore.on("click.cbp", function(d) {
            var e = a(this);
            d.preventDefault(), b.parent.isAnimating || e.hasClass("cbp-l-loadMore-stop") || (e.addClass("cbp-l-loadMore-loading"), c++, a.ajax({
                url: b.loadMore.attr("href"),
                type: "GET",
                dataType: "HTML"
            }).done(function(d) {
                var f, g;
                f = a(d).filter(function() {
                    return a(this).is("div.cbp-loadMore-block" + c)
                }), b.parent.$obj.cubeportfolio("appendItems", f.children(), function() {
                    e.removeClass("cbp-l-loadMore-loading"), g = a(d).filter(function() {
                        return a(this).is("div.cbp-loadMore-block" + (c + 1))
                    }), 0 === g.length && e.addClass("cbp-l-loadMore-stop")
                })
            }).fail(function() {}))
        })
    }, c.prototype.auto = function() {
        var c = this;
        c.parent.$obj.on("initComplete.cbp", function() {
            Object.create({
                init: function() {
                    var d = this;
                    d.isActive = !1, d.numberOfClicks = 0, c.loadMore.addClass("cbp-l-loadMore-loading"), d.window = a(b), d.addEvents(), d.getNewItems()
                },
                addEvents: function() {
                    var a, b = this;
                    c.loadMore.on("click.cbp", function(a) {
                        a.preventDefault()
                    }), b.window.on("scroll.loadMoreObject", function() {
                        clearTimeout(a), a = setTimeout(function() {
                            c.parent.isAnimating || b.getNewItems()
                        }, 80)
                    }), c.parent.$obj.on("filterComplete.cbp", function() {
                        b.getNewItems()
                    })
                },
                getNewItems: function() {
                    var b, d, e = this;
                    e.isActive || c.loadMore.hasClass("cbp-l-loadMore-stop") || (b = c.loadMore.offset().top, d = e.window.scrollTop() + e.window.height(), b > d || (e.isActive = !0, e.numberOfClicks++, a.ajax({
                        url: c.loadMore.attr("href"),
                        type: "GET",
                        dataType: "HTML",
                        cache: !0
                    }).done(function(b) {
                        var d, f;
                        d = a(b).filter(function() {
                            return a(this).is("div.cbp-loadMore-block" + e.numberOfClicks)
                        }), c.parent.$obj.cubeportfolio("appendItems", d.html(), function() {
                            f = a(b).filter(function() {
                                return a(this).is("div.cbp-loadMore-block" + (e.numberOfClicks + 1))
                            }), 0 === f.length ? (c.loadMore.addClass("cbp-l-loadMore-stop"), e.window.off("scroll.loadMoreObject"), c.parent.$obj.off("filterComplete.cbp")) : (e.isActive = !1, e.window.trigger("scroll.loadMoreObject"))
                        })
                    }).fail(function() {
                        e.isActive = !1
                    })))
                }
            }).init()
        })
    }, c.prototype.destroy = function() {
        var c = this;
        c.loadMore.off(".cbp"), a(b).off("scroll.loadMoreObject")
    }, d.Plugins.LoadMore = function(a) {
        return "" === a.options.loadMore ? null : new c(a)
    }
}(jQuery, window, document), jQuery.fn.cubeportfolio.options = {
        filters: "",
        loadMore: "",
        loadMoreAction: "click",
        search: "",
        layoutMode: "grid",
        sortToPreventGaps: !1,
        drag: !0,
        auto: !1,
        autoTimeout: 5e3,
        autoPauseOnHover: !0,
        showNavigation: !0,
        showPagination: !0,
        rewindNav: !0,
        scrollByPage: !1,
        defaultFilter: "*",
        filterDeeplinking: !1,
        animationType: "fadeOut",
        gridAdjustment: "responsive",
        mediaQueries: !1,
        gapHorizontal: 10,
        gapVertical: 10,
        caption: "pushTop",
        displayType: "lazyLoading",
        displayTypeSpeed: 400,
        lightboxDelegate: ".cbp-lightbox",
        lightboxGallery: !0,
        lightboxTitleSrc: "data-title",
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        singlePageDelegate: ".cbp-singlePage",
        singlePageDeeplinking: !0,
        singlePageStickyNavigation: !0,
        singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageAnimation: "left",
        singlePageCallback: function() {},
        singlePageInlineDelegate: ".cbp-singlePageInline",
        singlePageInlinePosition: "top",
        singlePageInlineInFocus: !0,
        singlePageInlineCallback: function() {}
    },
    function(a, b, c) {
        "use strict";

        function d(a) {
            var b = this;
            b.parent = a, a.options.lightboxShowCounter === !1 && (a.options.lightboxCounter = ""), a.options.singlePageShowCounter === !1 && (a.options.singlePageCounter = ""), a.registerEvent("initStartRead", function() {
                b.run()
            }, !0)
        }
        var e = a.fn.cubeportfolio.Constructor,
            f = {
                init: function(b, d) {
                    var e, f = this;
                    if (f.cubeportfolio = b, f.type = d, f.isOpen = !1, f.options = f.cubeportfolio.options, "lightbox" === d && f.cubeportfolio.registerEvent("resizeWindow", function() {
                            f.resizeImage()
                        }), "singlePageInline" === d) return f.startInline = -1, f.height = 0, f.createMarkupSinglePageInline(), void f.cubeportfolio.registerEvent("resizeGrid", function() {
                        f.isOpen && f.close()
                    });
                    if (f.createMarkup(), "singlePage" === d && (f.cubeportfolio.registerEvent("resizeWindow", function() {
                            if (f.options.singlePageStickyNavigation) {
                                var a = f.wrap[0].clientWidth;
                                a > 0 && (f.navigationWrap.width(a), f.navigation.width(a))
                            }
                        }), f.options.singlePageDeeplinking)) {
                        f.url = location.href, "#" === f.url.slice(-1) && (f.url = f.url.slice(0, -1));
                        var g = f.url.split("#cbp="),
                            h = g.shift();
                        if (a.each(g, function(b, c) {
                                return f.cubeportfolio.blocksOn.each(function(b, d) {
                                    var g = a(d).find(f.options.singlePageDelegate + '[href="' + c + '"]');
                                    return g.length ? (e = g, !1) : void 0
                                }), e ? !1 : void 0
                            }), e) {
                            f.url = h;
                            var i = e,
                                j = i.attr("data-cbp-singlePage"),
                                k = [];
                            j ? k = i.closest(a(".cbp-item")).find('[data-cbp-singlePage="' + j + '"]') : f.cubeportfolio.blocksOn.each(function(b, c) {
                                var d = a(c);
                                d.not(".cbp-item-off") && d.find(f.options.singlePageDelegate).each(function(b, c) {
                                    a(c).attr("data-cbp-singlePage") || k.push(c)
                                })
                            }), f.openSinglePage(k, e[0])
                        } else if (g.length) {
                            var l = c.createElement("a");
                            l.setAttribute("href", g[0]), f.openSinglePage([l], l)
                        }
                    }
                },
                createMarkup: function() {
                    var b = this,
                        d = "";
                    "singlePage" === b.type && "left" !== b.options.singlePageAnimation && (d = " cbp-popup-singlePage-" + b.options.singlePageAnimation), b.wrap = a("<div/>", {
                        "class": "cbp-popup-wrap cbp-popup-" + b.type + d,
                        "data-action": "lightbox" === b.type ? "close" : ""
                    }).on("click.cbp", function(c) {
                        if (!b.stopEvents) {
                            var d = a(c.target).attr("data-action");
                            b[d] && (b[d](), c.preventDefault())
                        }
                    }), b.content = a("<div/>", {
                        "class": "cbp-popup-content"
                    }).appendTo(b.wrap), a("<div/>", {
                        "class": "cbp-popup-loadingBox"
                    }).appendTo(b.wrap), "ie8" === e.Private.browser && (b.bg = a("<div/>", {
                        "class": "cbp-popup-ie8bg",
                        "data-action": "lightbox" === b.type ? "close" : ""
                    }).appendTo(b.wrap)), b.navigationWrap = a("<div/>", {
                        "class": "cbp-popup-navigation-wrap"
                    }).appendTo(b.wrap), b.navigation = a("<div/>", {
                        "class": "cbp-popup-navigation"
                    }).appendTo(b.navigationWrap), b.closeButton = a("<div/>", {
                        "class": "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(b.navigation), b.nextButton = a("<div/>", {
                        "class": "cbp-popup-next",
                        title: "Next (Right arrow key)",
                        "data-action": "next"
                    }).appendTo(b.navigation), b.prevButton = a("<div/>", {
                        "class": "cbp-popup-prev",
                        title: "Previous (Left arrow key)",
                        "data-action": "prev"
                    }).appendTo(b.navigation), "singlePage" === b.type && (b.options.singlePageCounter && (b.counter = a(b.options.singlePageCounter).appendTo(b.navigation), b.counter.text("")), b.content.on("click.cbp", b.options.singlePageDelegate, function(a) {
                        a.preventDefault();
                        var c, d = b.dataArray.length,
                            e = this.getAttribute("href");
                        for (c = 0; d > c && b.dataArray[c].url !== e; c++);
                        b.singlePageJumpTo(c - b.current)
                    }), b.wrap.on("mousewheel.cbp DOMMouseScroll.cbp", function(a) {
                        a.stopImmediatePropagation()
                    })), a(c).on("keydown.cbp", function(a) {
                        b.isOpen && (b.stopEvents || (37 === a.keyCode ? b.prev() : 39 === a.keyCode ? b.next() : 27 === a.keyCode && b.close()))
                    })
                },
                createMarkupSinglePageInline: function() {
                    var b = this;
                    b.wrap = a("<div/>", {
                        "class": "cbp-popup-singlePageInline"
                    }).on("click.cbp", function(c) {
                        if (!b.stopEvents) {
                            var d = a(c.target).attr("data-action");
                            d && b[d] && (b[d](), c.preventDefault())
                        }
                    }), b.content = a("<div/>", {
                        "class": "cbp-popup-content"
                    }).appendTo(b.wrap), b.navigation = a("<div/>", {
                        "class": "cbp-popup-navigation"
                    }).appendTo(b.wrap), b.closeButton = a("<div/>", {
                        "class": "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(b.navigation)
                },
                destroy: function() {
                    var b = this,
                        d = a("body");
                    a(c).off("keydown.cbp"), d.off("click.cbp", b.options.lightboxDelegate), d.off("click.cbp", b.options.singlePageDelegate), b.content.off("click.cbp", b.options.singlePageDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.singlePageInlineDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.lightboxDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.singlePageDelegate), b.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"), b.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), b.wrap.remove()
                },
                openLightbox: function(d, e) {
                    var f, g, h = this,
                        i = 0,
                        j = [];
                    if (!h.isOpen) {
                        if (h.isOpen = !0, h.stopEvents = !1, h.dataArray = [], h.current = null, f = e.getAttribute("data-href"), null === f) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        a.each(d, function(b, c) {
                            var d, e = c.getAttribute("data-href"),
                                g = e,
                                k = "isImage";
                            if (-1 === a.inArray(e, j)) {
                                if (f === e) h.current = i;
                                else if (!h.options.lightboxGallery) return;
                                /youtube/i.test(e) ? (d = e.substring(e.lastIndexOf("v=") + 2), /autoplay=/i.test(d) || (d += "&autoplay=1"), d = d.replace(/\?|&/, "?"), g = "//www.youtube.com/embed/" + d, k = "isYoutube") : /vimeo\.com/i.test(e) ? (d = e.substring(e.lastIndexOf("/") + 1), /autoplay=/i.test(d) || (d += "&autoplay=1"), d = d.replace(/\?|&/, "?"), g = "//player.vimeo.com/video/" + d, k = "isVimeo") : /www\.ted\.com/i.test(e) ? (g = "http://embed.ted.com/talks/" + e.substring(e.lastIndexOf("/") + 1) + ".html", k = "isTed") : /soundcloud\.com/i.test(e) ? (g = e, k = "isSoundCloud") : /(\.mp4)|(\.ogg)|(\.ogv)|(\.webm)/i.test(e) ? (g = e.split(-1 !== e.indexOf("|") ? "|" : "%7C"), k = "isSelfHostedVideo") : /\.mp3$/i.test(e) && (g = e, k = "isSelfHostedAudio"), h.dataArray.push({
                                    src: g,
                                    title: c.getAttribute(h.options.lightboxTitleSrc),
                                    type: k
                                }), i++
                            }
                            j.push(e)
                        }), h.counterTotal = h.dataArray.length, 1 === h.counterTotal ? (h.nextButton.hide(), h.prevButton.hide(), h.dataActionImg = "") : (h.nextButton.show(), h.prevButton.show(), h.dataActionImg = 'data-action="next"'), h.wrap.appendTo(c.body), h.scrollTop = a(b).scrollTop(), h.originalStyle = a("html").attr("style"), a("html").css({
                            overflow: "hidden",
                            paddingRight: b.innerWidth - a(c).width()
                        }), h.wrap.show(), g = h.dataArray[h.current], h[g.type](g)
                    }
                },
                openSinglePage: function(d, f) {
                    var g, h = this,
                        i = 0,
                        j = [];
                    if (!h.isOpen) {
                        if (h.cubeportfolio.singlePageInline && h.cubeportfolio.singlePageInline.isOpen && h.cubeportfolio.singlePageInline.close(), h.isOpen = !0, h.stopEvents = !1, h.dataArray = [], h.current = null, g = f.getAttribute("href"), null === g) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        if (a.each(d, function(b, c) {
                                var d = c.getAttribute("href"); - 1 === a.inArray(d, j) && (g === d && (h.current = i), h.dataArray.push({
                                    url: d,
                                    element: c
                                }), i++), j.push(d)
                            }), h.counterTotal = h.dataArray.length, 1 === h.counterTotal ? (h.nextButton.hide(), h.prevButton.hide()) : (h.nextButton.show(), h.prevButton.show()), h.wrap.appendTo(c.body), h.scrollTop = a(b).scrollTop(), a("html").css({
                                overflow: "hidden",
                                paddingRight: b.innerWidth - a(c).width()
                            }), h.wrap.scrollTop(0), h.wrap.show(), h.finishOpen = 2, h.navigationMobile = a(), h.wrap.one(e.Private.transitionend, function() {
                                var b;
                                h.options.singlePageStickyNavigation && (h.wrap.addClass("cbp-popup-singlePage-sticky"), b = h.wrap[0].clientWidth, h.navigationWrap.width(b), ("android" === e.Private.browser || "ios" === e.Private.browser) && (h.navigationMobile = a("<div/>", {
                                    "class": "cbp-popup-singlePage cbp-popup-singlePage-sticky",
                                    id: h.wrap.attr("id")
                                }).on("click.cbp", function(b) {
                                    if (!h.stopEvents) {
                                        var c = a(b.target).attr("data-action");
                                        h[c] && (h[c](), b.preventDefault())
                                    }
                                }), h.navigationMobile.appendTo(c.body).append(h.navigationWrap))), h.finishOpen--, h.finishOpen <= 0 && h.updateSinglePageIsOpen.call(h)
                            }), "ie8" === e.Private.browser || "ie9" === e.Private.browser) {
                            if (h.options.singlePageStickyNavigation) {
                                var k = h.wrap[0].clientWidth;
                                h.navigationWrap.width(k), setTimeout(function() {
                                    h.wrap.addClass("cbp-popup-singlePage-sticky")
                                }, 1e3)
                            }
                            h.finishOpen--
                        }
                        h.wrap.addClass("cbp-popup-loading"), h.wrap.offset(), h.wrap.addClass("cbp-popup-singlePage-open"), h.options.singlePageDeeplinking && (h.url = h.url.split("#cbp=")[0], location.href = h.url + "#cbp=" + h.dataArray[h.current].url), a.isFunction(h.options.singlePageCallback) && h.options.singlePageCallback.call(h, h.dataArray[h.current].url, h.dataArray[h.current].element)
                    }
                },
                openSinglePageInline: function(c, d, e) {
                    var f, g, h, i, j = this;
                    if (e = e || !1, j.fromOpen = e, j.storeBlocks = c, j.storeCurrentBlock = d, j.isOpen) return g = a(d).closest(".cbp-item").index(), void(j.dataArray[j.current].url !== d.getAttribute("href") || j.current !== g ? j.cubeportfolio.singlePageInline.close("open", {
                        blocks: c,
                        currentBlock: d,
                        fromOpen: !0
                    }) : j.close());
                    if (j.isOpen = !0, j.stopEvents = !1, j.dataArray = [], j.current = null, f = d.getAttribute("href"), null === f) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                    if (h = a(d).closest(".cbp-item")[0], c.each(function(a, b) {
                            h === b && (j.current = a)
                        }), j.dataArray[j.current] = {
                            url: f,
                            element: d
                        }, i = a(j.dataArray[j.current].element).parents(".cbp-item").addClass("cbp-singlePageInline-active"), j.counterTotal = c.length, j.wrap.insertBefore(j.cubeportfolio.wrapper), "top" === j.options.singlePageInlinePosition ? (j.startInline = 0, j.top = 0, j.firstRow = !0, j.lastRow = !1) : "bottom" === j.options.singlePageInlinePosition ? (j.startInline = j.counterTotal, j.top = j.cubeportfolio.height, j.firstRow = !1, j.lastRow = !0) : "above" === j.options.singlePageInlinePosition ? (j.startInline = j.cubeportfolio.cols * Math.floor(j.current / j.cubeportfolio.cols), j.top = a(c[j.current]).data("cbp").top, 0 === j.startInline ? j.firstRow = !0 : (j.top -= j.options.gapHorizontal, j.firstRow = !1), j.lastRow = !1) : (j.top = a(c[j.current]).data("cbp").top + a(c[j.current]).data("cbp").height, j.startInline = Math.min(j.cubeportfolio.cols * (Math.floor(j.current / j.cubeportfolio.cols) + 1), j.counterTotal), j.firstRow = !1, j.lastRow = j.startInline === j.counterTotal ? !0 : !1), j.wrap[0].style.height = j.wrap.outerHeight(!0) + "px", j.deferredInline = a.Deferred(), j.options.singlePageInlineInFocus) {
                        j.scrollTop = a(b).scrollTop();
                        var k = j.cubeportfolio.$obj.offset().top + j.top - 100;
                        j.scrollTop !== k ? a("html,body").animate({
                            scrollTop: k
                        }, 350).promise().then(function() {
                            j.resizeSinglePageInline(), j.deferredInline.resolve()
                        }) : (j.resizeSinglePageInline(), j.deferredInline.resolve())
                    } else j.resizeSinglePageInline(), j.deferredInline.resolve();
                    j.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-open"), j.wrap.css({
                        top: j.top
                    }), a.isFunction(j.options.singlePageInlineCallback) && j.options.singlePageInlineCallback.call(j, j.dataArray[j.current].url, j.dataArray[j.current].element)
                },
                resizeSinglePageInline: function() {
                    var a = this;
                    a.height = a.firstRow || a.lastRow ? a.wrap.outerHeight(!0) : a.wrap.outerHeight(!0) - a.options.gapHorizontal, a.storeBlocks.each(function(b, c) {
                        b < a.startInline ? e.Private.modernBrowser ? c.style[e.Private.transform] = "" : c.style.marginTop = "" : e.Private.modernBrowser ? c.style[e.Private.transform] = "translate3d(0px, " + a.height + "px, 0)" : c.style.marginTop = a.height + "px"
                    }), a.cubeportfolio.obj.style.height = a.cubeportfolio.height + a.height + "px"
                },
                revertResizeSinglePageInline: function() {
                    var b = this;
                    b.deferredInline = a.Deferred(), b.storeBlocks.each(function(a, b) {
                        e.Private.modernBrowser ? b.style[e.Private.transform] = "" : b.style.marginTop = ""
                    }), b.cubeportfolio.obj.style.height = b.cubeportfolio.height + "px"
                },
                appendScriptsToWrap: function(a) {
                    var b = this,
                        d = 0,
                        e = function(f) {
                            var g = c.createElement("script"),
                                h = f.src;
                            g.type = "text/javascript", g.readyState ? g.onreadystatechange = function() {
                                ("loaded" == g.readyState || "complete" == g.readyState) && (g.onreadystatechange = null, d++, a[d] && e(a[d]))
                            } : g.onload = function() {
                                d++, a[d] && e(a[d])
                            }, h ? g.src = h : g.text = f.text, b.content[0].appendChild(g)
                        };
                    e(a[0])
                },
                updateSinglePage: function(b, c, d) {
                    var e, f = this;
                    f.content.addClass("cbp-popup-content").removeClass("cbp-popup-content-basic"), d === !1 && f.content.removeClass("cbp-popup-content").addClass("cbp-popup-content-basic"), f.counter && (e = a(f.getCounterMarkup(f.options.singlePageCounter, f.current + 1, f.counterTotal)), f.counter.text(e.text())), f.content.html(b), c && f.appendScriptsToWrap(c), f.cubeportfolio.$obj.trigger("updateSinglePageStart.cbp"), f.finishOpen--, f.finishOpen <= 0 && f.updateSinglePageIsOpen.call(f)
                },
                updateSinglePageIsOpen: function() {
                    var b, c = this;
                    c.wrap.addClass("cbp-popup-ready"), c.wrap.removeClass("cbp-popup-loading"), b = c.content.find(".cbp-slider"), b ? (b.find(".cbp-slider-item").addClass("cbp-item"), c.slider = b.cubeportfolio({
                        layoutMode: "slider",
                        mediaQueries: [{
                            width: 1,
                            cols: 1
                        }],
                        gapHorizontal: 0,
                        gapVertical: 0,
                        caption: "",
                        coverRatio: ""
                    })) : c.slider = null, ("android" === e.Private.browser || "ios" === e.Private.browser) && a("html").css({
                        position: "fixed"
                    }), c.cubeportfolio.$obj.trigger("updateSinglePageComplete.cbp")
                },
                updateSinglePageInline: function(a, b) {
                    var c = this;
                    c.content.html(a), b && c.appendScriptsToWrap(b), c.cubeportfolio.$obj.trigger("updateSinglePageInlineStart.cbp"), c.singlePageInlineIsOpen.call(c)
                },
                singlePageInlineIsOpen: function() {
                    function a() {
                        b.wrap.addClass("cbp-popup-singlePageInline-ready"), b.wrap[0].style.height = "", b.resizeSinglePageInline(), b.cubeportfolio.$obj.trigger("updateSinglePageInlineComplete.cbp")
                    }
                    var b = this;
                    b.cubeportfolio.loadImages(b.wrap, function() {
                        var c = b.content.find(".cbp-slider");
                        c.length ? (c.find(".cbp-slider-item").addClass("cbp-item"), c.one("initComplete.cbp", function() {
                            b.deferredInline.done(a)
                        }), c.on("pluginResize.cbp", function() {
                            b.deferredInline.done(a)
                        }), b.slider = c.cubeportfolio({
                            layoutMode: "slider",
                            displayType: "default",
                            mediaQueries: [{
                                width: 1,
                                cols: 1
                            }],
                            gapHorizontal: 0,
                            gapVertical: 0,
                            caption: "",
                            coverRatio: ""
                        })) : (b.slider = null, b.deferredInline.done(a))
                    })
                },
                isImage: function(b) {
                    {
                        var c = this;
                        new Image
                    }
                    c.tooggleLoading(!0), c.cubeportfolio.loadImages(a('<div><img src="' + b.src + '"></div>'), function() {
                        c.updateImagesMarkup(b.src, b.title, c.getCounterMarkup(c.options.lightboxCounter, c.current + 1, c.counterTotal)), c.tooggleLoading(!1)
                    })
                },
                isVimeo: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isYoutube: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isTed: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSoundCloud: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSelfHostedVideo: function(a) {
                    var b = this;
                    b.updateSelfHostedVideo(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSelfHostedAudio: function(a) {
                    var b = this;
                    b.updateSelfHostedAudio(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                getCounterMarkup: function(a, b, c) {
                    if (!a.length) return "";
                    var d = {
                        current: b,
                        total: c
                    };
                    return a.replace(/\{\{current}}|\{\{total}}/gi, function(a) {
                        return d[a.slice(2, -2)]
                    })
                },
                updateSelfHostedVideo: function(a, b, c) {
                    var d, e = this;
                    e.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var f = '<div class="cbp-popup-lightbox-iframe"><video controls="controls" height="auto" style="width: 100%">';
                    for (d = 0; d < a.length; d++) /(\.mp4)/i.test(a[d]) ? f += '<source src="' + a[d] + '" type="video/mp4">' : /(\.ogg)|(\.ogv)/i.test(a[d]) ? f += '<source src="' + a[d] + '" type="video/ogg">' : /(\.webm)/i.test(a[d]) && (f += '<source src="' + a[d] + '" type="video/webm">');
                    f += 'Your browser does not support the video tag.</video><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>", e.content.html(f), e.wrap.addClass("cbp-popup-ready"), e.preloadNearbyImages()
                },
                updateSelfHostedAudio: function(a, b, c) {
                    var d = this;
                    d.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-iframe"><audio controls="controls" height="auto" style="width: 100%"><source src="' + a + '" type="audio/mpeg">Your browser does not support the audio tag.</audio><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.preloadNearbyImages()
                },
                updateVideoMarkup: function(a, b, c) {
                    var d = this;
                    d.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-iframe"><iframe src="' + a + '" frameborder="0" allowfullscreen scrolling="no"></iframe><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.preloadNearbyImages()
                },
                updateImagesMarkup: function(a, b, c) {
                    var d = this;
                    d.wrap.removeClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-figure"><img src="' + a + '" class="cbp-popup-lightbox-img" ' + d.dataActionImg + ' /><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.resizeImage(), d.preloadNearbyImages()
                },
                next: function() {
                    var a = this;
                    a[a.type + "JumpTo"](1)
                },
                prev: function() {
                    var a = this;
                    a[a.type + "JumpTo"](-1)
                },
                lightboxJumpTo: function(a) {
                    var b, c = this;
                    c.current = c.getIndex(c.current + a), b = c.dataArray[c.current], c[b.type](b)
                },
                singlePageJumpTo: function(b) {
                    var c = this;
                    c.current = c.getIndex(c.current + b), a.isFunction(c.options.singlePageCallback) && (c.resetWrap(), c.wrap.scrollTop(0), c.wrap.addClass("cbp-popup-loading"), c.options.singlePageCallback.call(c, c.dataArray[c.current].url, c.dataArray[c.current].element), c.options.singlePageDeeplinking && (location.href = c.url + "#cbp=" + c.dataArray[c.current].url))
                },
                resetWrap: function() {
                    var a = this;
                    "singlePage" === a.type && a.options.singlePageDeeplinking && (location.href = a.url + "#")
                },
                getIndex: function(a) {
                    var b = this;
                    return a %= b.counterTotal, 0 > a && (a = b.counterTotal + a), a
                },
                close: function(c, d) {
                    function f() {
                        h.content.html(""), h.wrap.detach(), h.cubeportfolio.$obj.removeClass("cbp-popup-singlePageInline-open cbp-popup-singlePageInline-close"), "promise" === c && a.isFunction(d.callback) && d.callback.call(h.cubeportfolio)
                    }

                    function g() {
                        h.options.singlePageInlineInFocus && "promise" !== c ? a("html,body").animate({
                            scrollTop: h.scrollTop
                        }, 350).promise().then(function() {
                            f()
                        }) : f()
                    }
                    var h = this;
                    h.isOpen = !1, "singlePageInline" === h.type ? "open" === c ? (h.wrap.removeClass("cbp-popup-singlePageInline-ready"), a(h.dataArray[h.current].element).closest(".cbp-item").removeClass("cbp-singlePageInline-active"), h.openSinglePageInline(d.blocks, d.currentBlock, d.fromOpen)) : (h.height = 0,
                        h.revertResizeSinglePageInline(), h.wrap.removeClass("cbp-popup-singlePageInline-ready"), h.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-close"), h.startInline = -1, h.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), e.Private.modernBrowser ? h.wrap.one(e.Private.transitionend, function() {
                            g()
                        }) : g()) : "singlePage" === h.type ? (h.resetWrap(), h.wrap.removeClass("cbp-popup-ready"), ("android" === e.Private.browser || "ios" === e.Private.browser) && (a("html").css({
                        position: ""
                    }), h.navigationWrap.appendTo(h.wrap), h.navigationMobile.remove()), a(b).scrollTop(h.scrollTop), setTimeout(function() {
                        h.stopScroll = !0, h.navigationWrap.css({
                            top: h.wrap.scrollTop()
                        }), h.wrap.removeClass("cbp-popup-singlePage-open cbp-popup-singlePage-sticky"), ("ie8" === e.Private.browser || "ie9" === e.Private.browser) && (h.content.html(""), h.wrap.detach(), a("html").css({
                            overflow: "",
                            paddingRight: "",
                            position: ""
                        }), h.navigationWrap.removeAttr("style"))
                    }, 0), h.wrap.one(e.Private.transitionend, function() {
                        h.content.html(""), h.wrap.detach(), a("html").css({
                            overflow: "",
                            paddingRight: "",
                            position: ""
                        }), h.navigationWrap.removeAttr("style")
                    })) : (h.originalStyle ? a("html").attr("style", h.originalStyle) : a("html").css({
                        overflow: "",
                        paddingRight: ""
                    }), a(b).scrollTop(h.scrollTop), h.content.html(""), h.wrap.detach())
                },
                tooggleLoading: function(a) {
                    var b = this;
                    b.stopEvents = a, b.wrap[a ? "addClass" : "removeClass"]("cbp-popup-loading")
                },
                resizeImage: function() {
                    if (this.isOpen) {
                        var c = a(b).height(),
                            d = this.content.find("img"),
                            e = parseInt(d.css("margin-top"), 10) + parseInt(d.css("margin-bottom"), 10);
                        d.css("max-height", c - e + "px")
                    }
                },
                preloadNearbyImages: function() {
                    var a = [],
                        b = this;
                    a.push(b.getIndex(b.current + 1)), a.push(b.getIndex(b.current + 2)), a.push(b.getIndex(b.current + 3)), a.push(b.getIndex(b.current - 1)), a.push(b.getIndex(b.current - 2)), a.push(b.getIndex(b.current - 3));
                    for (var c = a.length - 1; c >= 0; c--) "isImage" === b.dataArray[a[c]].type && b.cubeportfolio.checkSrc(b.dataArray[a[c]].src)
                }
            },
            g = !1,
            h = !1;
        d.prototype.run = function() {
            var b = this,
                d = b.parent,
                e = a(c.body);
            d.lightbox = null, d.options.lightboxDelegate && !g && (g = !0, d.lightbox = Object.create(f), d.lightbox.init(d, "lightbox"), e.on("click.cbp", d.options.lightboxDelegate, function(c) {
                c.preventDefault();
                var e = a(this),
                    f = e.attr("data-cbp-lightbox"),
                    g = b.detectScope(e),
                    h = g.data("cubeportfolio"),
                    i = [];
                h ? h.blocksOn.each(function(b, c) {
                    var e = a(c);
                    e.not(".cbp-item-off") && e.find(d.options.lightboxDelegate).each(function(b, c) {
                        f ? a(c).attr("data-cbp-lightbox") === f && i.push(c) : i.push(c)
                    })
                }) : i = g.find(f ? d.options.lightboxDelegate + "[data-cbp-lightbox=" + f + "]" : d.options.lightboxDelegate), d.lightbox.openLightbox(i, e[0])
            })), d.singlePage = null, d.options.singlePageDelegate && !h && (h = !0, d.singlePage = Object.create(f), d.singlePage.init(d, "singlePage"), e.on("click.cbp", d.options.singlePageDelegate, function(c) {
                c.preventDefault();
                var e = a(this),
                    f = e.attr("data-cbp-singlePage"),
                    g = b.detectScope(e),
                    h = g.data("cubeportfolio"),
                    i = [];
                h ? h.blocksOn.each(function(b, c) {
                    var e = a(c);
                    e.not(".cbp-item-off") && e.find(d.options.singlePageDelegate).each(function(b, c) {
                        f ? a(c).attr("data-cbp-singlePage") === f && i.push(c) : i.push(c)
                    })
                }) : i = g.find(f ? d.options.singlePageDelegate + "[data-cbp-singlePage=" + f + "]" : d.options.singlePageDelegate), d.singlePage.openSinglePage(i, e[0])
            })), d.singlePageInline = null, d.options.singlePageDelegate && (d.singlePageInline = Object.create(f), d.singlePageInline.init(d, "singlePageInline"), d.$obj.on("click.cbp", d.options.singlePageInlineDelegate, function(a) {
                a.preventDefault(), d.singlePageInline.openSinglePageInline(d.blocksOn, this)
            }))
        }, d.prototype.detectScope = function(b) {
            var d, e, f;
            return d = b.closest(".cbp-popup-singlePageInline"), d.length ? (f = b.closest(".cbp", d[0]), f.length ? f : d) : (e = b.closest(".cbp-popup-singlePage"), e.length ? (f = b.closest(".cbp", e[0]), f.length ? f : e) : (f = b.closest(".cbp"), f.length ? f : a(c.body)))
        }, d.prototype.destroy = function() {
            var b = this.parent;
            a(c.body).off("click.cbp"), g = !1, h = !1, b.lightbox && b.lightbox.destroy(), b.singlePage && b.singlePage.destroy(), b.singlePageInline && b.singlePageInline.destroy()
        }, e.Plugins.PopUp = function(a) {
            return new d(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.Constructor;
        e.Private = {
            resizeEventArray: [],
            initResizeEvent: function(a) {
                var b = e.Private;
                0 === b.resizeEventArray.length && b.resizeEvent(), b.resizeEventArray.push(a)
            },
            destroyResizeEvent: function(c) {
                var d = e.Private,
                    f = a.map(d.resizeEventArray, function(a) {
                        return a.instance !== c ? a : void 0
                    });
                d.resizeEventArray = f, 0 === d.resizeEventArray.length && a(b).off("resize.cbp")
            },
            resizeEvent: function() {
                var c, d = e.Private;
                a(b).on("resize.cbp", function() {
                    clearTimeout(c), c = setTimeout(function() {
                        b.innerHeight != screen.height && a.each(d.resizeEventArray, function(a, b) {
                            b.fn.call(b.instance)
                        })
                    }, 50)
                })
            },
            checkInstance: function(b) {
                var c = a.data(this, "cubeportfolio");
                if (!c) throw new Error("cubeportfolio is not initialized. Initialize it before calling " + b + " method!");
                return c.triggerEvent("publicMethod"), c
            },
            browserInfo: function() {
                var a, c, f, g = e.Private,
                    h = navigator.appVersion;
                g.browser = -1 !== h.indexOf("MSIE 8.") ? "ie8" : -1 !== h.indexOf("MSIE 9.") ? "ie9" : -1 !== h.indexOf("MSIE 10.") ? "ie10" : b.ActiveXObject || "ActiveXObject" in b ? "ie11" : /android/gi.test(h) ? "android" : /iphone|ipad|ipod/gi.test(h) ? "ios" : /chrome/gi.test(h) ? "chrome" : "", f = g.styleSupport("perspective"), typeof f !== d && (a = g.styleSupport("transition"), g.transitionend = {
                    WebkitTransition: "webkitTransitionEnd",
                    transition: "transitionend"
                }[a], c = g.styleSupport("animation"), g.animationend = {
                    WebkitAnimation: "webkitAnimationEnd",
                    animation: "animationend"
                }[c], g.animationDuration = {
                    WebkitAnimation: "webkitAnimationDuration",
                    animation: "animationDuration"
                }[c], g.animationDelay = {
                    WebkitAnimation: "webkitAnimationDelay",
                    animation: "animationDelay"
                }[c], g.transform = g.styleSupport("transform"), a && c && g.transform && (g.modernBrowser = !0))
            },
            styleSupport: function(a) {
                var b, d = "Webkit" + a.charAt(0).toUpperCase() + a.slice(1),
                    e = c.createElement("div");
                return a in e.style ? b = a : d in e.style && (b = d), e = null, b
            }
        }, e.Private.browserInfo()
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.Constructor;
        e.Public = {
            init: function(a, b) {
                new e(this, a, b)
            },
            destroy: function(b) {
                var c = e.Private.checkInstance.call(this, "destroy");
                c.triggerEvent("beforeDestroy"), a.removeData(this, "cubeportfolio"), c.blocks.removeData("cbp"), c.$obj.removeClass("cbp-ready").removeAttr("style"), c.$ul.removeClass("cbp-wrapper"), e.Private.destroyResizeEvent(c), c.$obj.off(".cbp"), c.blocks.removeClass("cbp-item-off").removeAttr("style"), c.blocks.find(".cbp-item-wrapper").children().unwrap(), c.options.caption && c.$obj.removeClass("cbp-caption-active cbp-caption-" + c.options.caption), c.destroySlider(), c.$ul.unwrap(), c.addedWrapp && c.blocks.unwrap(), a.each(c.plugins, function(a, b) {
                    "function" == typeof b.destroy && b.destroy()
                }), a.isFunction(b) && b.call(c), c.triggerEvent("afterDestroy")
            },
            filter: function(b, c) {
                var f, g = e.Private.checkInstance.call(this, "filter");
                if (!g.isAnimating) {
                    if (g.isAnimating = !0, a.isFunction(c) && g.registerEvent("filterFinish", c, !0), a.isFunction(b)) {
                        if (f = b.call(g, g.blocks), f === d) throw new Error("When you call cubeportfolio API `filter` method with a param of type function you must return the blocks that will be visible.")
                    } else {
                        if (g.options.filterDeeplinking) {
                            var h = location.href.replace(/#cbpf=(.*?)([#\?&]|$)/gi, "");
                            location.href = h + "#cbpf=" + encodeURIComponent(b), g.singlePage && g.singlePage.url && (g.singlePage.url = location.href)
                        }
                        g.defaultFilter = b, f = g.filterConcat(g.defaultFilter)
                    }
                    g.singlePageInline && g.singlePageInline.isOpen ? g.singlePageInline.close("promise", {
                        callback: function() {
                            g.computeFilter(f)
                        }
                    }) : g.computeFilter(f)
                }
            },
            showCounter: function(b, c) {
                var d = e.Private.checkInstance.call(this, "showCounter");
                d.elems = b, a.each(b, function() {
                    var b, c = a(this),
                        e = c.data("filter");
                    b = d.blocks.filter(e).length, c.find(".cbp-filter-counter").text(b)
                }), a.isFunction(c) && c.call(d)
            },
            appendItems: function(b, c) {
                var d = e.Private.checkInstance.call(this, "appendItems"),
                    f = a(b).filter(".cbp-item");
                return d.isAnimating || f.length < 1 ? void(a.isFunction(c) && c.call(d)) : (d.isAnimating = !0, void(d.singlePageInline && d.singlePageInline.isOpen ? d.singlePageInline.close("promise", {
                    callback: function() {
                        d.addItems(f, c)
                    }
                }) : d.addItems(f, c)))
            }
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var c = this;
            c.parent = b, c.searchInput = a(b.options.search), c.searchInput.each(function(b, c) {
                var d = c.getAttribute("data-search");
                d || (d = "*"), a.data(c, "searchData", {
                    value: c.value,
                    el: d
                })
            });
            var d = null;
            c.searchInput.on("keyup.cbp paste.cbp", function(b) {
                b.preventDefault();
                var e = a(this);
                clearTimeout(d), d = setTimeout(function() {
                    c.runEvent.call(c, e)
                }, 300)
            }), c.searchNothing = c.searchInput.siblings(".cbp-search-nothing").detach(), c.searchNothingHeight = null, c.searchNothingHTML = c.searchNothing.html(), c.searchInput.siblings(".cbp-search-icon").on("click.cbp", function(b) {
                b.preventDefault(), c.runEvent.call(c, a(this).prev().val(""))
            })
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.runEvent = function(b) {
            var c = this,
                d = b.val(),
                e = b.data("searchData"),
                f = new RegExp(d, "i");
            e.value === d || c.parent.isAnimating || (e.value = d, d.length > 0 ? b.attr("value", d) : b.removeAttr("value"), c.parent.$obj.cubeportfolio("filter", function(b) {
                var g = b.filter(function(b, c) {
                    var d = a(c).find(e.el).text();
                    return d.search(f) > -1 ? !0 : void 0
                });
                if (0 === g.length && c.searchNothing.length) {
                    var h = c.searchNothingHTML.replace("{{query}}", d);
                    c.searchNothing.html(h), c.searchNothing.appendTo(c.parent.$obj), null === c.searchNothingHeight && (c.searchNothingHeight = c.searchNothing.outerHeight(!0)), c.parent.registerEvent("resizeMainContainer", function() {
                        c.parent.height = c.parent.height + c.searchNothingHeight, c.parent.obj.style.height = c.parent.height + "px"
                    }, !0)
                } else c.searchNothing.detach();
                return g
            }, function() {
                b.trigger("keyup.cbp")
            }))
        }, b.prototype.destroy = function() {
            var b = this;
            b.searchInput.off(".cbp"), b.searchInput.next(".cbp-search-icon").off(".cbp"), b.searchInput.each(function(b, c) {
                a.removeData(c)
            })
        }, c.Plugins.Search = function(a) {
            return "" === a.options.search ? null : new b(a)
        }
    }(jQuery, window, document), "function" != typeof Object.create && (Object.create = function(a) {
        function b() {}
        return b.prototype = a, new b
    }),
    function() {
        for (var a = 0, b = ["moz", "webkit"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
            var c = (new Date).getTime(),
                d = Math.max(0, 16 - (c - a)),
                e = window.setTimeout(function() {
                    b(c + d)
                }, d);
            return a = c + d, e
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        })
    }(),
    function(a) {
        "use strict";

        function b(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout, a.registerEvent("computeBlocksFinish", function(b) {
                a.blocksOn2On = a.blocksOnInitial.filter(b), a.blocksOn2Off = a.blocksOnInitial.not(b)
            })
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.filterLayout = function() {
            function b() {
                d.blocks.removeClass("cbp-item-on2off cbp-item-off2on cbp-item-on2on").each(function(b, d) {
                    var e = a(d).data("cbp");
                    e.left = e.leftNew, e.top = e.topNew, d.style.left = e.left + "px", d.style.top = e.top + "px", d.style[c.Private.transform] = ""
                }), d.blocksOff.addClass("cbp-item-off"), d.$obj.removeClass("cbp-animation-" + d.options.animationType), d.filterFinish()
            }
            var d = this;
            d.$obj.addClass("cbp-animation-" + d.options.animationType), d.blocksOn2On.addClass("cbp-item-on2on").each(function(b, d) {
                var e = a(d).data("cbp");
                d.style[c.Private.transform] = "translate3d(" + (e.leftNew - e.left) + "px, " + (e.topNew - e.top) + "px, 0)"
            }), d.blocksOn2Off.addClass("cbp-item-on2off"), d.blocksOff2On = d.blocksOn.filter(".cbp-item-off").removeClass("cbp-item-off").addClass("cbp-item-off2on").each(function(b, c) {
                var d = a(c).data("cbp");
                c.style.left = d.leftNew + "px", c.style.top = d.topNew + "px"
            }), d.blocksOn2Off.length ? d.blocksOn2Off.last().data("cbp").wrapper.one(c.Private.animationend, b) : d.blocksOff2On.length ? d.blocksOff2On.last().data("cbp").wrapper.one(c.Private.animationend, b) : b(), d.resizeMainContainer()
        }, b.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, c.Plugins.AnimationClassic = function(d) {
            return !c.Private.modernBrowser || a.inArray(d.options.animationType, ["boxShadow", "fadeOut", "flipBottom", "flipOut", "quicksand", "scaleSides", "skew"]) < 0 ? null : new b(d)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.filterLayout = function() {
            function b() {
                d.wrapper[0].removeChild(e), "sequentially" === d.options.animationType && d.blocksOn.each(function(b, d) {
                    a(d).data("cbp").wrapper[0].style[c.Private.animationDelay] = ""
                }), d.$obj.removeClass("cbp-animation-" + d.options.animationType), d.filterFinish()
            }
            var d = this,
                e = d.$ul[0].cloneNode(!0);
            e.setAttribute("class", "cbp-wrapper-helper"), d.wrapper[0].insertBefore(e, d.$ul[0]), requestAnimationFrame(function() {
                d.$obj.addClass("cbp-animation-" + d.options.animationType), d.blocksOff.addClass("cbp-item-off"), d.blocksOn.removeClass("cbp-item-off").each(function(b, e) {
                    var f = a(e).data("cbp");
                    f.left = f.leftNew, f.top = f.topNew, e.style.left = f.left + "px", e.style.top = f.top + "px", "sequentially" === d.options.animationType && (f.wrapper[0].style[c.Private.animationDelay] = 60 * b + "ms")
                }), d.blocksOn.length ? d.blocksOn.last().data("cbp").wrapper.one(c.Private.animationend, b) : d.blocksOnInitial.length ? d.blocksOnInitial.last().data("cbp").wrapper.one(c.Private.animationend, b) : b(), d.resizeMainContainer()
            })
        }, b.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, c.Plugins.AnimationClone = function(d) {
            return !c.Private.modernBrowser || a.inArray(d.options.animationType, ["fadeOutTop", "slideLeft", "sequentially"]) < 0 ? null : new b(d)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.filterLayout = function() {
            function b() {
                d.wrapper[0].removeChild(e[0]), d.$obj.removeClass("cbp-animation-" + d.options.animationType), d.blocks.each(function(b, d) {
                    a(d).data("cbp").wrapper[0].style[c.Private.animationDelay] = ""
                }), d.filterFinish()
            }
            var d = this,
                e = d.$ul.clone(!0, !0);
            e[0].setAttribute("class", "cbp-wrapper-helper"), d.wrapper[0].insertBefore(e[0], d.$ul[0]);
            var f = e.find(".cbp-item").not(".cbp-item-off");
            d.sortBlocks(f, "top"), f.children(".cbp-item-wrapper").each(function(a, b) {
                b.style[c.Private.animationDelay] = 50 * a + "ms"
            }), requestAnimationFrame(function() {
                d.$obj.addClass("cbp-animation-" + d.options.animationType), d.blocksOff.addClass("cbp-item-off"), d.blocksOn.removeClass("cbp-item-off").each(function(b, d) {
                    var e = a(d).data("cbp");
                    e.left = e.leftNew, e.top = e.topNew, d.style.left = e.left + "px", d.style.top = e.top + "px", e.wrapper[0].style[c.Private.animationDelay] = 50 * b + "ms"
                });
                var e = d.blocksOn.length,
                    g = f.length;
                0 === e && 0 === g ? b() : g > e ? f.last().children(".cbp-item-wrapper").one(c.Private.animationend, b) : d.blocksOn.last().data("cbp").wrapper.one(c.Private.animationend, b), d.resizeMainContainer()
            })
        }, b.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, c.Plugins.AnimationCloneDelay = function(d) {
            return !c.Private.modernBrowser || a.inArray(d.options.animationType, ["3dflip", "flipOutDelay", "foldLeft", "frontRow", "rotateRoom", "rotateSides", "scaleDown", "slideDelay", "unfold"]) < 0 ? null : new b(d)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.filterLayout = function() {
            function b() {
                d.wrapper[0].removeChild(e), d.$obj.removeClass("cbp-animation-" + d.options.animationType), d.filterFinish()
            }
            var d = this,
                e = d.$ul[0].cloneNode(!0);
            e.setAttribute("class", "cbp-wrapper-helper"), d.wrapper[0].insertBefore(e, d.$ul[0]), requestAnimationFrame(function() {
                d.$obj.addClass("cbp-animation-" + d.options.animationType), d.blocksOff.addClass("cbp-item-off"), d.blocksOn.removeClass("cbp-item-off").each(function(b, c) {
                    var d = a(c).data("cbp");
                    d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px"
                }), d.blocksOn.length ? d.$ul.one(c.Private.animationend, b) : d.blocksOnInitial.length ? a(e).one(c.Private.animationend, b) : b(), d.resizeMainContainer()
            })
        }, b.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, c.Plugins.AnimationWrapper = function(d) {
            return !c.Private.modernBrowser || a.inArray(d.options.animationType, ["bounceBottom", "bounceLeft", "bounceTop", "moveLeft"]) < 0 ? null : new b(d)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var c = this;
            c.parent = b, b.registerEvent("initFinish", function() {
                b.$obj.on("click.cbp", ".cbp-caption-defaultWrap", function(c) {
                    if (c.preventDefault(), !b.isAnimating) {
                        b.isAnimating = !0;
                        var d = a(this),
                            e = d.next(),
                            f = d.parent(),
                            g = {
                                position: "relative",
                                height: e.outerHeight(!0)
                            },
                            h = {
                                position: "relative",
                                height: 0
                            };
                        if (b.$obj.addClass("cbp-caption-expand-active"), f.hasClass("cbp-caption-expand-open")) {
                            var i = h;
                            h = g, g = i, f.removeClass("cbp-caption-expand-open")
                        }
                        e.css(g), b.$obj.one("pluginResize.cbp", function() {
                            b.isAnimating = !1, b.$obj.removeClass("cbp-caption-expand-active"), 0 === g.height && (f.removeClass("cbp-caption-expand-open"), e.attr("style", ""))
                        }), b.layoutAndAdjustment(), e.css(h), requestAnimationFrame(function() {
                            f.addClass("cbp-caption-expand-open"), e.css(g), "slider" === b.options.layoutMode && b.updateSlider(), b.triggerEvent("resizeGrid")
                        })
                    }
                })
            }, !0)
        }
        var c = a.fn.cubeportfolio.Constructor;
        b.prototype.destroy = function() {
            this.parent.$obj.find(".cbp-caption-defaultWrap").off("click.cbp").parent().removeClass("cbp-caption-expand-active")
        }, c.Plugins.CaptionExpand = function(a) {
            return "expand" !== a.options.caption ? null : new b(a)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var d = a.Deferred();
            b.pushQueue("delayFrame", d), b.registerEvent("initEndWrite", function() {
                b.blocksOn.each(function(a, d) {
                    d.style[c.Private.animationDelay] = a * b.options.displayTypeSpeed + "ms"
                }), b.$obj.addClass("cbp-displayType-bottomToTop"), b.blocksOn.last().one(c.Private.animationend, function() {
                    b.$obj.removeClass("cbp-displayType-bottomToTop"), b.blocksOn.each(function(a, b) {
                        b.style[c.Private.animationDelay] = ""
                    }), d.resolve()
                })
            }, !0)
        }
        var c = a.fn.cubeportfolio.Constructor;
        c.Plugins.BottomToTop = function(a) {
            return c.Private.modernBrowser && "bottomToTop" === a.options.displayType && 0 !== a.blocksOn.length ? new b(a) : null
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var d = a.Deferred();
            b.pushQueue("delayFrame", d), b.registerEvent("initEndWrite", function() {
                b.obj.style[c.Private.animationDuration] = b.options.displayTypeSpeed + "ms", b.$obj.addClass("cbp-displayType-fadeInToTop"), b.$obj.one(c.Private.animationend, function() {
                    b.$obj.removeClass("cbp-displayType-fadeInToTop"), b.obj.style[c.Private.animationDuration] = "", d.resolve()
                })
            }, !0)
        }
        var c = a.fn.cubeportfolio.Constructor;
        c.Plugins.FadeInToTop = function(a) {
            return c.Private.modernBrowser && "fadeInToTop" === a.options.displayType && 0 !== a.blocksOn.length ? new b(a) : null
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var d = a.Deferred();
            b.pushQueue("delayFrame", d), b.registerEvent("initEndWrite", function() {
                b.obj.style[c.Private.animationDuration] = b.options.displayTypeSpeed + "ms", b.$obj.addClass("cbp-displayType-lazyLoading"), b.$obj.one(c.Private.animationend, function() {
                    b.$obj.removeClass("cbp-displayType-lazyLoading"), b.obj.style[c.Private.animationDuration] = "", d.resolve()
                })
            }, !0)
        }
        var c = a.fn.cubeportfolio.Constructor;
        c.Plugins.LazyLoading = function(a) {
            return !c.Private.modernBrowser || "lazyLoading" !== a.options.displayType && "fadeIn" !== a.options.displayType || 0 === a.blocksOn.length ? null : new b(a)
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";

        function b(b) {
            var d = a.Deferred();
            b.pushQueue("delayFrame", d), b.registerEvent("initEndWrite", function() {
                b.blocksOn.each(function(a, d) {
                    d.style[c.Private.animationDelay] = a * b.options.displayTypeSpeed + "ms"
                }), b.$obj.addClass("cbp-displayType-sequentially"), b.blocksOn.last().one(c.Private.animationend, function() {
                    b.$obj.removeClass("cbp-displayType-sequentially"), b.blocksOn.each(function(a, b) {
                        b.style[c.Private.animationDelay] = ""
                    }), d.resolve()
                })
            }, !0)
        }
        var c = a.fn.cubeportfolio.Constructor;
        c.Plugins.DisplaySequentially = function(a) {
            return c.Private.modernBrowser && "sequentially" === a.options.displayType && 0 !== a.blocksOn.length ? new b(a) : null
        }
    }(jQuery, window, document),
    function(a) {
        "use strict";
        var b = a.fn.cubeportfolio.Constructor;
        a.extend(b.prototype, {
            mosaicLayoutReset: function() {
                var b = this;
                b.blocksAreSorted = !1, b.blocksOn.each(function(b, c) {
                    a(c).data("cbp").pack = !1
                })
            },
            mosaicLayout: function() {
                var a, b = this,
                    c = b.blocksOn.length,
                    d = {};
                for (b.freeSpaces = [{
                        leftStart: 0,
                        leftEnd: b.widthAvailable,
                        topStart: 0,
                        topEnd: Math.pow(2, 18)
                    }], a = 0; c > a; a++) {
                    if (d = b.getSpaceIndexAndBlock(), null === d) return b.sortBlocksToPreventGaps(), void b.mosaicLayout();
                    b.generateF1F2(d.spaceIndex, d.dataBlock), b.generateG1G2G3G4(d.dataBlock), b.cleanFreeSpaces(), b.addHeightToBlocks()
                }
                b.blocksAreSorted && b.sortBlocks(b.blocksOn, "topNew")
            },
            getSpaceIndexAndBlock: function() {
                var b = this,
                    c = null;
                return a.each(b.freeSpaces, function(d, e) {
                    var f = e.leftEnd - e.leftStart,
                        g = e.topEnd - e.topStart;
                    return b.blocksOn.each(function(b, h) {
                        var i = a(h).data("cbp");
                        if (i.pack !== !0) return i.widthAndGap <= f && i.heightAndGap <= g ? (i.pack = !0, c = {
                            spaceIndex: d,
                            dataBlock: i
                        }, i.leftNew = e.leftStart, i.topNew = e.topStart, !1) : void 0
                    }), !b.blocksAreSorted && b.options.sortToPreventGaps && d > 0 ? (c = null, !1) : null !== c ? !1 : void 0
                }), c
            },
            generateF1F2: function(a, b) {
                var c = this,
                    d = c.freeSpaces[a],
                    e = {
                        leftStart: d.leftStart + b.widthAndGap,
                        leftEnd: d.leftEnd,
                        topStart: d.topStart,
                        topEnd: d.topEnd
                    },
                    f = {
                        leftStart: d.leftStart,
                        leftEnd: d.leftEnd,
                        topStart: d.topStart + b.heightAndGap,
                        topEnd: d.topEnd
                    };
                c.freeSpaces.splice(a, 1), e.leftEnd > e.leftStart && e.topEnd > e.topStart && (c.freeSpaces.splice(a, 0, e), a++), f.leftEnd > f.leftStart && f.topEnd > f.topStart && c.freeSpaces.splice(a, 0, f)
            },
            generateG1G2G3G4: function(b) {
                var c = this,
                    d = [];
                a.each(c.freeSpaces, function(a, e) {
                    var f = c.intersectSpaces(e, b);
                    return null === f ? void d.push(e) : (c.generateG1(e, f, d), c.generateG2(e, f, d), c.generateG3(e, f, d), void c.generateG4(e, f, d))
                }), c.freeSpaces = d
            },
            intersectSpaces: function(a, b) {
                var c = {
                    leftStart: b.leftNew,
                    leftEnd: b.leftNew + b.widthAndGap,
                    topStart: b.topNew,
                    topEnd: b.topNew + b.heightAndGap
                };
                if (a.leftStart === c.leftStart && a.leftEnd === c.leftEnd && a.topStart === c.topStart && a.topEnd === c.topEnd) return null;
                var d = Math.max(a.leftStart, c.leftStart),
                    e = Math.min(a.leftEnd, c.leftEnd),
                    f = Math.max(a.topStart, c.topStart),
                    g = Math.min(a.topEnd, c.topEnd);
                return d >= e || f >= g ? null : {
                    leftStart: d,
                    leftEnd: e,
                    topStart: f,
                    topEnd: g
                }
            },
            generateG1: function(a, b, c) {
                a.topStart !== b.topStart && c.push({
                    leftStart: a.leftStart,
                    leftEnd: a.leftEnd,
                    topStart: a.topStart,
                    topEnd: b.topStart
                })
            },
            generateG2: function(a, b, c) {
                a.leftEnd !== b.leftEnd && c.push({
                    leftStart: b.leftEnd,
                    leftEnd: a.leftEnd,
                    topStart: a.topStart,
                    topEnd: a.topEnd
                })
            },
            generateG3: function(a, b, c) {
                a.topEnd !== b.topEnd && c.push({
                    leftStart: a.leftStart,
                    leftEnd: a.leftEnd,
                    topStart: b.topEnd,
                    topEnd: a.topEnd
                })
            },
            generateG4: function(a, b, c) {
                a.leftStart !== b.leftStart && c.push({
                    leftStart: a.leftStart,
                    leftEnd: b.leftStart,
                    topStart: a.topStart,
                    topEnd: a.topEnd
                })
            },
            cleanFreeSpaces: function() {
                var a = this;
                a.freeSpaces.sort(function(a, b) {
                    return a.topStart > b.topStart ? 1 : a.topStart < b.topStart ? -1 : a.leftStart > b.leftStart ? 1 : a.leftStart < b.leftStart ? -1 : 0
                }), a.correctSubPixelValues(), a.removeNonMaximalFreeSpaces()
            },
            correctSubPixelValues: function() {
                var a, b, c, d, e = this;
                for (a = 0, b = e.freeSpaces.length - 1; b > a; a++) c = e.freeSpaces[a], d = e.freeSpaces[a + 1], d.topStart - c.topStart <= 1 && (d.topStart = c.topStart)
            },
            removeNonMaximalFreeSpaces: function() {
                var b = this;
                b.uniqueFreeSpaces(), b.freeSpaces = a.map(b.freeSpaces, function(c, d) {
                    return a.each(b.freeSpaces, function(a, b) {
                        return d !== a && b.leftStart <= c.leftStart && b.leftEnd >= c.leftEnd && b.topStart <= c.topStart && b.topEnd >= c.topEnd ? (c = null, !1) : void 0
                    }), c
                })
            },
            uniqueFreeSpaces: function() {
                var b = this,
                    c = [];
                a.each(b.freeSpaces, function(b, d) {
                    a.each(c, function(a, b) {
                        return b.leftStart === d.leftStart && b.leftEnd === d.leftEnd && b.topStart === d.topStart && b.topEnd === d.topEnd ? (d = null, !1) : void 0
                    }), null !== d && c.push(d)
                }), b.freeSpaces = c
            },
            addHeightToBlocks: function() {
                var b = this;
                if (!(b.freeSpaces.length > 1)) {
                    var c = b.freeSpaces[0].topStart;
                    b.blocksOn.each(function(b, d) {
                        var e = a(d).data("cbp");
                        if (e.pack === !0) {
                            var f = c - e.topNew - e.heightAndGap;
                            0 > f && (d.style.height = e.height + f + "px")
                        }
                    })
                }
            },
            sortBlocksToPreventGaps: function() {
                var b = this;
                b.blocksAreSorted = !0, b.blocksOn.sort(function(b, c) {
                    var d = a(b).data("cbp"),
                        e = a(c).data("cbp");
                    return d.widthAndGap < e.widthAndGap ? 1 : d.widthAndGap > e.widthAndGap ? -1 : d.heightAndGap < e.heightAndGap ? 1 : d.heightAndGap > e.heightAndGap ? -1 : d.index > e.index ? 1 : d.index < e.index ? -1 : void 0
                }), b.blocksOn.each(function(b, c) {
                    a(c).data("cbp").pack = !1, c.style.height = ""
                })
            },
            sortBlocks: function(b, c) {
                b.sort(function(b, d) {
                    var e = a(b).data("cbp"),
                        f = a(d).data("cbp");
                    return e[c] > f[c] ? 1 : e[c] < f[c] ? -1 : e.leftNew > f.leftNew ? 1 : e.leftNew < f.leftNew ? -1 : 0
                })
            }
        })
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.Constructor;
        a.extend(e.prototype, {
            sliderMarkup: function() {
                var b = this;
                b.sliderStopEvents = !1, b.sliderActive = 0, b.$obj.one("initComplete.cbp", function() {
                    b.$obj.addClass("cbp-mode-slider")
                }), b.nav = a("<div/>", {
                    "class": "cbp-nav"
                }), b.nav.on("click.cbp", "[data-slider-action]", function(c) {
                    if (c.preventDefault(), c.stopImmediatePropagation(), c.stopPropagation(), !b.sliderStopEvents) {
                        var d = a(this),
                            e = d.attr("data-slider-action");
                        b[e + "Slider"] && b[e + "Slider"](d)
                    }
                }), b.options.showNavigation && (b.controls = a("<div/>", {
                    "class": "cbp-nav-controls"
                }), b.navPrev = a("<div/>", {
                    "class": "cbp-nav-prev",
                    "data-slider-action": "prev"
                }).appendTo(b.controls), b.navNext = a("<div/>", {
                    "class": "cbp-nav-next",
                    "data-slider-action": "next"
                }).appendTo(b.controls), b.controls.appendTo(b.nav)), b.options.showPagination && (b.navPagination = a("<div/>", {
                    "class": "cbp-nav-pagination"
                }).appendTo(b.nav)), (b.controls || b.navPagination) && b.nav.appendTo(b.$obj), b.updateSliderPagination(), b.options.auto && (b.options.autoPauseOnHover && (b.mouseIsEntered = !1, b.$obj.on("mouseenter.cbp", function() {
                    b.mouseIsEntered = !0, b.stopSliderAuto()
                }).on("mouseleave.cbp", function() {
                    b.mouseIsEntered = !1, b.startSliderAuto()
                })), b.startSliderAuto()), b.options.drag && e.Private.modernBrowser && b.dragSlider()
            },
            updateSlider: function() {
                var a = this;
                a.updateSliderPosition(), a.updateSliderPagination()
            },
            updateSliderPagination: function() {
                var b, c, d = this;
                if (d.options.showPagination) {
                    for (b = Math.ceil(d.blocksOn.length / d.cols), d.navPagination.empty(), c = b - 1; c >= 0; c--) a("<div/>", {
                        "class": "cbp-nav-pagination-item",
                        "data-slider-action": "jumpTo"
                    }).appendTo(d.navPagination);
                    d.navPaginationItems = d.navPagination.children()
                }
                d.enableDisableNavSlider()
            },
            destroySlider: function() {
                var b = this;
                "slider" === b.options.layoutMode && (b.$obj.off(".cbp"), b.$obj.removeClass("cbp-mode-slider"), b.options.showNavigation && (b.nav.off(".cbp"), b.nav.remove()), b.navPagination && b.navPagination.remove(), b.$ul.removeAttr("style"), b.$ul.off(".cbp"), a(c).off(".cbp"), b.options.auto && b.stopSliderAuto())
            },
            nextSlider: function() {
                var a = this;
                if (a.isEndSlider()) {
                    if (!a.isRewindNav()) return;
                    a.sliderActive = 0
                } else a.options.scrollByPage ? a.sliderActive = Math.min(a.sliderActive + a.cols, a.blocksOn.length - a.cols) : a.sliderActive += 1;
                a.goToSlider()
            },
            prevSlider: function() {
                var a = this;
                if (a.isStartSlider()) {
                    if (!a.isRewindNav()) return;
                    a.sliderActive = a.blocksOn.length - a.cols
                } else a.options.scrollByPage ? a.sliderActive = Math.max(0, a.sliderActive - a.cols) : a.sliderActive -= 1;
                a.goToSlider()
            },
            jumpToSlider: function(a) {
                var b = this,
                    c = Math.min(a.index() * b.cols, b.blocksOn.length - b.cols);
                c !== b.sliderActive && (b.sliderActive = c, b.goToSlider())
            },
            jumpDragToSlider: function(a) {
                var b, c, d, e = this,
                    f = a > 0 ? !0 : !1;
                e.options.scrollByPage ? (b = e.cols * e.columnWidth, c = e.cols) : (b = e.columnWidth, c = 1), a = Math.abs(a), d = Math.floor(a / b) * c, a % b > 20 && (d += c), e.sliderActive = f ? Math.min(e.sliderActive + d, e.blocksOn.length - e.cols) : Math.max(0, e.sliderActive - d), e.goToSlider()
            },
            isStartSlider: function() {
                return 0 === this.sliderActive
            },
            isEndSlider: function() {
                var a = this;
                return a.sliderActive + a.cols > a.blocksOn.length - 1
            },
            goToSlider: function() {
                var a = this;
                a.enableDisableNavSlider(), a.updateSliderPosition()
            },
            startSliderAuto: function() {
                var a = this;
                return a.isDrag ? void a.stopSliderAuto() : void(a.timeout = setTimeout(function() {
                    a.nextSlider(), a.startSliderAuto()
                }, a.options.autoTimeout))
            },
            stopSliderAuto: function() {
                clearTimeout(this.timeout)
            },
            enableDisableNavSlider: function() {
                var a, b, c = this;
                c.isRewindNav() || (b = c.isStartSlider() ? "addClass" : "removeClass", c.navPrev[b]("cbp-nav-stop"), b = c.isEndSlider() ? "addClass" : "removeClass", c.navNext[b]("cbp-nav-stop")), c.options.showPagination && (a = c.options.scrollByPage ? Math.ceil(c.sliderActive / c.cols) : c.isEndSlider() ? c.navPaginationItems.length - 1 : Math.floor(c.sliderActive / c.cols), c.navPaginationItems.removeClass("cbp-nav-pagination-active").eq(a).addClass("cbp-nav-pagination-active"))
            },
            isRewindNav: function() {
                var a = this;
                return a.options.showNavigation ? a.blocksOn.length <= a.cols ? !1 : a.options.rewindNav ? !0 : !1 : !0
            },
            sliderItemsLength: function() {
                return this.blocksOn.length <= this.cols
            },
            sliderLayout: function() {
                var b = this;
                b.blocksOn.each(function(c, d) {
                    var e = a(d).data("cbp");
                    e.leftNew = b.columnWidth * c, e.topNew = 0, b.sliderFreeSpaces.push({
                        topStart: e.heightAndGap
                    })
                }), b.getFreeSpacesForSlider(), b.$ul.width(b.columnWidth * b.blocksOn.length - b.options.gapVertical)
            },
            getFreeSpacesForSlider: function() {
                var a = this;
                a.freeSpaces = a.sliderFreeSpaces.slice(a.sliderActive, a.sliderActive + a.cols), a.freeSpaces.sort(function(a, b) {
                    return a.topStart > b.topStart ? 1 : a.topStart < b.topStart ? -1 : void 0
                })
            },
            updateSliderPosition: function() {
                var a = this,
                    b = -a.sliderActive * a.columnWidth;
                e.Private.modernBrowser ? a.$ul[0].style[e.Private.transform] = "translate3d(" + b + "px, 0px, 0)" : a.$ul[0].style.left = b + "px", a.getFreeSpacesForSlider(), a.resizeMainContainer()
            },
            dragSlider: function() {
                function f(b) {
                    if (!q.sliderItemsLength()) {
                        if (u ? p = b : b.preventDefault(), q.options.auto && q.stopSliderAuto(), s) return void a(m).one("click.cbp", function() {
                            return !1
                        });
                        m = a(b.target), k = j(b).x, l = 0, n = -q.sliderActive * q.columnWidth, o = q.columnWidth * (q.blocksOn.length - q.cols), r.on(t.move, h), r.on(t.end, g), q.$obj.addClass("cbp-mode-slider-dragStart")
                    }
                }

                function g() {
                    q.$obj.removeClass("cbp-mode-slider-dragStart"), s = !0, 0 !== l ? (m.one("click.cbp", function() {
                        return !1
                    }), q.jumpDragToSlider(l), q.$ul.one(e.Private.transitionend, i)) : i.call(q), r.off(t.move), r.off(t.end)
                }

                function h(a) {
                    l = k - j(a).x, (l > 8 || -8 > l) && a.preventDefault(), q.isDrag = !0;
                    var b = n - l;
                    0 > l && n > l ? b = (n - l) / 5 : l > 0 && -o > n - l && (b = -o + (o + n - l) / 5), e.Private.modernBrowser ? q.$ul[0].style[e.Private.transform] = "translate3d(" + b + "px, 0px, 0)" : q.$ul[0].style.left = b + "px"
                }

                function i() {
                    if (s = !1, q.isDrag = !1, q.options.auto) {
                        if (q.mouseIsEntered) return;
                        q.startSliderAuto()
                    }
                }

                function j(a) {
                    return a.originalEvent !== d && a.originalEvent.touches !== d && (a = a.originalEvent.touches[0]), {
                        x: a.pageX,
                        y: a.pageY
                    }
                }
                var k, l, m, n, o, p, q = this,
                    r = a(c),
                    s = !1,
                    t = {},
                    u = !1;
                q.isDrag = !1, "ontouchstart" in b || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? (t = {
                    start: "touchstart.cbp",
                    move: "touchmove.cbp",
                    end: "touchend.cbp"
                }, u = !0) : t = {
                    start: "mousedown.cbp",
                    move: "mousemove.cbp",
                    end: "mouseup.cbp"
                }, q.$ul.on(t.start, f)
            },
            sliderLayoutReset: function() {
                var a = this;
                a.freeSpaces = [], a.sliderFreeSpaces = []
            }
        })
    }(jQuery, window, document);