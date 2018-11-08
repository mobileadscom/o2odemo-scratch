class miniPages {
	constructor(options) {
	  this.currentPage = options.initialPage;
	  this.switching = false;
	  this.pages = [];
    var pages = document.getElementsByClassName(options.pageClass);
		var pageBtns = document.getElementsByClassName(options.pageButtonClass);
		var pageWrappers = options.pageWrapperClass;
		for (var pw = 0; pw < pageWrappers.length; pw++) {
			pageWrappers[pw].style.position = 'relative';
		}

		for (var p = 0; p < pages.length; p++) {
			pages[p].style.width = '100%';
			pages[p].style.display = 'none';
			this.pages.push(pages[p].id);
		}

		for (var n = 0; n < pageBtns.length; n++) {
			pageBtns[n].addEventListener('click', (e) => { 
				if (!this.switching) {
					this.toPage(e.target.dataset.target);
				}
			});
		}
		this.currentPage.style.display = 'block';
	}

	toPage(pageId) {
		var toPage = document.getElementById(pageId);
		if (toPage) {
			var toPageIndex = this.pages.indexOf(pageId);
			var cPageIndex = this.pages.indexOf(this.currentPage.id);
			if (toPageIndex > -1) {
	    	var direction = toPageIndex > cPageIndex ? 1 : -1;
	    	toPage.style.transform = direction == 1 ? 'translateX(30%)' : 'translateX(-30%)';
	    	toPage.style.opacity = '0';
			toPage.style.display = 'block';
			toPage.style.transition = 'all 0.3s';
			this.currentPage.style.transition = 'all 0.3s';
			this.currentPage.style.position = 'absolute';
			this.switching = true;
			setTimeout(() => {
				toPage.style.transform = 'translateX(0)';
				toPage.style.opacity = '1';
				this.currentPage.style.transform = direction == 1 ? 'translateX(-30%)' : 'translateX(30%)';
				this.currentPage.style.opacity = '0';
				setTimeout(() => {	
					toPage.style.transition = 'none';
					this.currentPage.style.transition = 'none';
					this.currentPage.style.display = 'none';
					this.currentPage.style.transform = 'translateX(0)';
					this.currentPage.style.opacity = '1';
					this.currentPage = toPage;
					this.switching = false;
				}, 350);
			}, 100);
			}
		}
	}
}

export default miniPages;