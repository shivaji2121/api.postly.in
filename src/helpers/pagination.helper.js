module.exports.getPaginationData = (currentPage, pageSize, totalRecords) => {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    return {
        total_records: Number(totalRecords),
        total_pages: totalPages,
        page_size: pageSize,
        current_page: currentPage,
        next_page: nextPage,
        prev_page: prevPage
    };
};
