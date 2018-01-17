namespace Friday.Knockout.ViewModels {


    export class DataGridViewModel {
        private data: KnockoutObservableArray<object> = ko.observableArray([]);
        
        private itemsPerPage: number;
        public Columns: KnockoutObservableArray<string> = ko.observableArray([]);
        public CurrentPageIndex: KnockoutObservable<number> = ko.observable(0);
        public MaxPageIndex: KnockoutComputed<number> = ko.pureComputed(this.getMaxPageIndex,this);
        public CurrentPageData: KnockoutComputed<Array<object>> = ko.pureComputed(this.getDataSlice,this); 

        private getDataSlice() : Array<object> {
            var startIndex = this.itemsPerPage * this.CurrentPageIndex();
            return ko.unwrap(this.data).slice(startIndex, startIndex + this.itemsPerPage);
        }

        private getMaxPageIndex(): number {
            return Math.ceil(ko.unwrap(this.data).length / this.itemsPerPage) - 1;
        }

        constructor(columns: Array<string>, itemsPerPage: number = 5) {
            this.Columns(columns);
            this.itemsPerPage = itemsPerPage;
        }

        public Set(data: Array<object>) {
            this.data(data);

        }

        public NextPage() {
            var index = this.CurrentPageIndex() + 1;
            this.SetPage(index);
        }

        public PrevPage() {
            var index = this.CurrentPageIndex() - 1;
            this.SetPage(index);
        }

        public LastPage() {
            this.SetPage(this.MaxPageIndex());
        }

        public FirstPage() {
            this.SetPage(0);
        }

        public SetPage(index: number) {
            if(index >= 0 && index <= this.MaxPageIndex())
                this.CurrentPageIndex(index);
        }
    }

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

}