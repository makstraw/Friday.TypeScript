namespace Friday.Knockout.ViewModels {


    export class DataGridViewModel<T extends Object> {
        private data: KnockoutObservableArray<T> = ko.observableArray([]);
        
        public ItemsPerPage: KnockoutObservable<number>;
        public Columns: KnockoutObservableArray<string> = ko.observableArray([]);
        public CurrentPageIndex: KnockoutObservable<number> = ko.observable(0);

        public MaxPageIndex: KnockoutComputed<number> = ko.pureComputed(function(this: DataGridViewModel<T>): number {
            return Math.ceil(ko.unwrap(this.data).length / this.ItemsPerPage()) - 1;
        }, this);

        public CurrentPageData: KnockoutComputed<Array<T>> = ko.pureComputed(function (this: DataGridViewModel<T>): Array<T> {
            var startIndex = this.ItemsPerPage() * this.CurrentPageIndex();
            return ko.unwrap(this.data).slice(startIndex, startIndex + this.ItemsPerPage());
        },this); 


        constructor(columns: Array<string>, itemsPerPage: number = 5) {
            this.Columns(columns);
            this.ItemsPerPage = ko.observable(itemsPerPage);
        }

        public Set(data: Array<T>) {
            this.data(data);

        }

        public Add(record: T) {
            this.data.push(record);
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