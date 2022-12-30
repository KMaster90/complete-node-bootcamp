class APIFeatures {
	
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	
	filter() {
		const { ...queryObj } = this.queryString;
		this.query.find(queryObj);
		return this;
	}
	
	sort() {
		const { sort } = this.queryString;
		this.query.sort(sort);
		return this;
	}
	
	limitFields() {
		const { fields } = this.queryString;
		this.query.select(fields && fields.split(',').join(' ') || '-__v');
		return this;
	}
	
	// Pagination
	paginate() {
		const {
			page = 1,
			limit = 100
		} = this.queryString;
		const skip = (page - 1) * limit;
		this.query.skip(skip).limit(limit);
		return this;
	}
	
}

module.exports = APIFeatures;
