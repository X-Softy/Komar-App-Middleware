export interface Category {
  id: string;
  title: string;
}

export const converter = {
  fromFirestoreList(
    snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  ): Category[] {
    const categories: Category[] = [];
    snapshot.forEach((categoryDoc) => {
      const category: Category = this.fromFirestore(
        categoryDoc.id,
        categoryDoc.data(),
      );
      categories.push(category);
    });
    return categories;
  },

  fromFirestore(categoryId: string, categoryDocData): Category {
    return {
      id: categoryId,
      title: categoryDocData.title,
    };
  },
};
