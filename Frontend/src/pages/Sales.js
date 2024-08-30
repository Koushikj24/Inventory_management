import React, { useState, useEffect, useContext } from "react";
import Quagga from "quagga"; // Import QuaggaJS
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [camera, setCamera] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
    setCamera(true);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      paddingBottom: 5,
      paddingTop: 5,
    },
    productName: {
      width: "30%",
      fontWeight: "bold",
    },
    storeName: {
      width: "25%",
      fontStyle: "italic",
    },
    column: {
      width: "15%",
      textAlign: "center",
    },
    totalSaleAmount: {
      width: "20%",
      textAlign: "right",
      fontWeight: "bold",
      color: "red",
    },
  });
  
  const generateInvoicePDF = () => {
    // Calculate total amount
    const totalAmount = sales.reduce((total, sale) => total + sale.TotalSaleAmount, 0);
  
    // Create a PDF document
    const Invoice = () => (
      <Document>
        <Page style={styles.page}>
          <View>
            <Text style={styles.header}>Invoice</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.productName}>Product Name</Text>
            <Text style={styles.storeName}>Store Name</Text>
            <Text style={styles.column}>Stock Sold</Text>
            <Text style={styles.column}>Sales Date</Text>
            <Text style={styles.totalSaleAmount}>Net Amount</Text>
          </View>
          {sales.map((sale) => (
            <View key={sale._id} style={styles.section}>
              <Text style={styles.productName}>{sale.ProductID?.name}</Text>
              <Text style={styles.storeName}>{sale.StoreID?.name}</Text>
              <Text style={styles.column}>{sale.StockSold}</Text>
              <Text style={styles.column}>{sale.SaleDate}</Text>
              <Text style={styles.totalSaleAmount}>{sale.TotalSaleAmount}</Text>
            </View>
          ))}
          {/* Total amount section */}
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text style={[styles.column, { fontWeight: "bold" }]}>Total Amount:</Text>
            <Text style={[styles.totalSaleAmount, { fontWeight: "bold" }]}>Rs. {totalAmount}</Text>
          </View>
        </Page>
      </Document>
    );
  
    // Render the PDF document
    const invoicePdf = <Invoice />;
  
    // Download link for the PDF document
    return (
      <PDFDownloadLink document={invoicePdf} fileName="invoice.pdf">
        {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download Invoice")}
      </PDFDownloadLink>
    );
  };
  

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Sales
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs  rounded"
                onClick={generateInvoicePDF}
              >
                {generateInvoicePDF()}
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.ProductID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StoreID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.SaleDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    ₹{element.TotalSaleAmount}
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                  colSpan="4"
                >
                  Total
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                ₹
                  {sales.reduce(
                    (total, element) => total + element.TotalSaleAmount,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
