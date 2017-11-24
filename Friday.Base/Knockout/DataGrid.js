var AtsLibKnockout;
(function (AtsLibKnockout) {
    var DataGrid = (function () {
        function DataGrid(columns, itemsPerPage) {
            if (itemsPerPage === void 0) { itemsPerPage = 5; }
            this.data = ko.observableArray([]);
            this.Columns = ko.observableArray([]);
            this.CurrentPageIndex = ko.observable(0);
            this.MaxPageIndex = ko.pureComputed(this.getMaxPageIndex, this);
            this.CurrentPageData = ko.pureComputed(this.getDataSlice, this);
            this.Columns(columns);
            this.itemsPerPage = itemsPerPage;
        }
        DataGrid.prototype.getDataSlice = function () {
            var startIndex = this.itemsPerPage * this.CurrentPageIndex();
            return ko.unwrap(this.data).slice(startIndex, startIndex + this.itemsPerPage);
        };
        DataGrid.prototype.getMaxPageIndex = function () {
            return Math.ceil(ko.unwrap(this.data).length / this.itemsPerPage) - 1;
        };
        DataGrid.prototype.Set = function (data) {
            this.data(data);
        };
        DataGrid.prototype.NextPage = function () {
            var index = this.CurrentPageIndex() + 1;
            this.SetPage(index);
        };
        DataGrid.prototype.PrevPage = function () {
            var index = this.CurrentPageIndex() - 1;
            this.SetPage(index);
        };
        DataGrid.prototype.LastPage = function () {
            this.SetPage(this.MaxPageIndex());
        };
        DataGrid.prototype.FirstPage = function () {
            this.SetPage(0);
        };
        DataGrid.prototype.SetPage = function (index) {
            if (index >= 0 && index <= this.MaxPageIndex())
                this.CurrentPageIndex(index);
        };
        return DataGrid;
    }());
    AtsLibKnockout.DataGrid = DataGrid;
    //    ko.bindingHandlers.dataGrid = {
    //        init() {
    //            return { 'controlsDescendantBindings': true };
    //        },
    //        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
    //        update(element, viewModelAccessor, allBindings) {
    //            var viewModel = viewModelAccessor();
    //
    //            // Empty the element
    //            while (element.firstChild)
    //                ko.removeNode(element.firstChild);
    //
    //            // Allow the default templates to be overridden
    //            var gridTemplateName = allBindings.get('simpleGridTemplate') || "ko_simpleGrid_grid",
    //                pageLinksTemplateName = allBindings.get('simpleGridPagerTemplate') || "ko_simpleGrid_pageLinks";
    //
    //            // Render the main grid
    //            var gridContainer = element.appendChild(document.createElement("DIV"));
    //            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");
    //
    //            // Render the page links
    //            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
    //            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
    //        }
    //    };
})(AtsLibKnockout || (AtsLibKnockout = {}));
//# sourceMappingURL=DataGrid.js.map