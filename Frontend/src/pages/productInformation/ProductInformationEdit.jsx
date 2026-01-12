import { useParams } from "react-router-dom";
import { useEffect } from "react";

import productInformationStore from "../../store/productInformationStore";
import ProductInformationForm from "./ProductInformationForm";

const ProductInformationEdit = () => {
  const { getProductInformationById, ProductInformationById } =
    productInformationStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getProductInformationById(id);
    }
  }, [id, getProductInformationById]);

  if (!getProductInformationById) return <div>Loading...</div>;

  return <ProductInformationForm mode="edit" initialData={ProductInformationById} />;
};

export default ProductInformationEdit;
