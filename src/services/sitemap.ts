import { db } from '../lib/mongo';
import parse from '../lib/parse';

class SitemapService {
	getPaths(onlyEnabled) {
		const slug = null;
		onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);

		return Promise.all([
			this.getSlugArrayFromReserved(),
			this.getSlugArrayFromProductCategories(slug, onlyEnabled),
			this.getSlugArrayFromProducts(slug, onlyEnabled),
			this.getSlugArrayFromPages(slug, onlyEnabled),
		]).then(([reserved, productCategories, products, pages]) => {
			const paths = [...reserved, ...productCategories, ...products, ...pages];
			return paths;
		});
	}

	getPathsWithoutSlashes(slug, onlyEnabled) {
		return Promise.all([
			this.getSlugArrayFromReserved(),
			this.getSlugArrayFromProductCategories(slug, onlyEnabled),
			this.getSlugArrayFromPages(slug, onlyEnabled),
		]).then(([reserved, productCategories, pages]) => {
			const paths = [...reserved, ...productCategories, ...pages];
			return paths;
		});
	}

	getPathsWithSlash(slug, onlyEnabled) {
		return Promise.all([
			this.getSlugArrayFromProducts(slug, onlyEnabled),
			this.getSlugArrayFromPages(slug, onlyEnabled),
		]).then(([products, pages]) => {
			const paths = [...products, ...pages];
			return paths;
		});
	}

	getSlugArrayFromReserved() {
		const paths = [];

		paths.push({ path: '/api', type: 'reserved' });
		paths.push({ path: '/ajax', type: 'reserved' });
		paths.push({ path: '/assets', type: 'reserved' });
		paths.push({ path: '/images', type: 'reserved' });
		paths.push({ path: '/admin', type: 'reserved' });
		paths.push({ path: '/signin', type: 'reserved' });
		paths.push({ path: '/signout', type: 'reserved' });
		paths.push({ path: '/signup', type: 'reserved' });
		paths.push({ path: '/post', type: 'reserved' });
		paths.push({ path: '/posts', type: 'reserved' });
		paths.push({ path: '/public', type: 'reserved' });
		paths.push({ path: '/rss', type: 'reserved' });
		paths.push({ path: '/feed', type: 'reserved' });
		paths.push({ path: '/setup', type: 'reserved' });
		paths.push({ path: '/tag', type: 'reserved' });
		paths.push({ path: '/tags', type: 'reserved' });
		paths.push({ path: '/user', type: 'reserved' });
		paths.push({ path: '/users', type: 'reserved' });
		paths.push({ path: '/sitemap.xml', type: 'reserved' });
		paths.push({ path: '/robots.txt', type: 'reserved' });
		paths.push({ path: '/settings', type: 'reserved' });
		paths.push({ path: '/find', type: 'reserved' });
		paths.push({ path: '/account', type: 'reserved' });

		paths.push({ path: '/search', type: 'search' });

		return paths;
	}

	getSlugArrayFromProducts(slug, onlyEnabled) {
		const categoriesFilter = { slug: [] };
		const productFilter = { slug: [], enabled: undefined };

		if (slug) {
			const slugParts = slug.split('/');
			categoriesFilter.slug = slugParts[0];
			productFilter.slug = slugParts[1];
		}

		if (onlyEnabled === true) {
			productFilter.enabled = true;
		}

		return Promise.all([
			db
				.collection('productCategories')
				.find(categoriesFilter)
				.project({ slug: 1 })
				.toArray(),
			db
				.collection('products')
				.find(productFilter)
				.project({ slug: 1, category_id: 1 })
				.toArray(),
		]).then(([categories, products]) =>
			products.map((product) => {
				const category = categories.find(
					(c) => c._id.toString() === (product.category_id || '').toString()
				);
				const categorySlug = category ? category.slug : '-';
				return {
					path: `/${categorySlug}/${product.slug}`,
					type: 'product',
					resource: product._id,
				};
			})
		);
	}

	getSlugArrayFromPages(slug, onlyEnabled) {
		const filter = this.getFilterWithoutSlashes(slug);
		if (onlyEnabled === true) {
			filter.slug = true;
		}

		return db
			.collection('pages')
			.find(filter)
			.project({ slug: 1 })
			.toArray()
			.then((items) =>
				items.map((item) => ({
					path: `/${item.slug}`,
					type: 'page',
					resource: item._id,
				}))
			);
	}

	getSlugArrayFromProductCategories(slug, onlyEnabled) {
		const filter = this.getFilterWithoutSlashes(slug);
		if (onlyEnabled === true) {
			filter.slug = true;
		}

		return db
			.collection('productCategories')
			.find(filter)
			.project({ slug: 1 })
			.toArray()
			.then((items) =>
				items.map((item) => ({
					path: `/${item.slug}`,
					type: 'product-category',
					resource: item._id,
				}))
			);
	}

	getFilterWithoutSlashes(slug) {
		if (slug) {
			return { slug };
		}
		return {};
	}

	getSinglePath(path, onlyEnabled = false) {
		onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);
		// convert path to slash (remove first slash)
		const slug = path.substr(1);
		if (slug.includes('/')) {
			// slug = category-slug/product-slug
			return this.getPathsWithSlash(slug, onlyEnabled).then((paths) =>
				paths.find((e) => e.path === path)
			);
		}
		// slug = slug
		return this.getPathsWithoutSlashes(slug, onlyEnabled).then((paths) =>
			paths.find((e) => e.path === path)
		);
	}
}

export default new SitemapService();