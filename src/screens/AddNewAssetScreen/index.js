import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import SearchableDropdown from "react-native-searchable-dropdown";
import styles from "./styles";
import { useRecoilState } from "recoil";
import { allPortfolioBoughtAssetsInStorage } from "../../atoms/PortfolioAssets";
import { getAllCoin, getDetailedCoinData } from "../../services/requests";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const AddNewAssetScreen = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [boughtAssetQuantity, setboughtAssetQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCoinId, setselectedCoinId] = useState(null);
  const [selectedCoin, setselectedCoin] = useState(null);

  const [assetsInStorage, setAssetsInStorage] = useRecoilState(
    allPortfolioBoughtAssetsInStorage
  );

  const navigation = useNavigation();

  const isQuantityEntered = () => boughtAssetQuantity === "";

  const fetchAllCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const allCoins = await getAllCoin();
    setAllCoins(allCoins);
    setLoading(false);
  };

  const fetchCoinInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinInfo = await getDetailedCoinData(selectedCoinId);
    setselectedCoin(coinInfo);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      fetchCoinInfo();
    }
  }, [selectedCoinId]);

  const onAddNewAsset = async () => {
    const newAsset = {
      id: selectedCoin.id,
      name: selectedCoin.name,
      image: selectedCoin.image.small,
      ticker: selectedCoin.symbol.toUpperCase(),
      quantityBought: parseFloat(boughtAssetQuantity),
      priceBought: selectedCoin.market_data.current_price.usd

    }

    const newAssets = [...assetsInStorage, newAsset]
    const jsonValue = JSON.stringify(newAssets)

    await AsyncStorage.setItem('@portfolio_coins', jsonValue)
    setAssetsInStorage(newAssets)
    navigation.goBack()
  };

  return (
    <DismissKeyboard>
      <View style={{ flex: 1 }}>
        <SearchableDropdown
          items={allCoins}
          onItemSelect={(item) => setselectedCoinId(item.id)}
          containerStyle={styles.dropdownContainer}
          itemStyle={styles.item}
          itemTextStyle={{ color: "white" }}
          resetValue={false}
          placeholder={selectedCoinId || "Select a coin.."}
          placeholderTextColor="white"
          textInputProps={{
            underlineColorAndroid: "transparent",
            style: {
              padding: 12,
              borderWidth: 1.5,
              borderColor: "#444444",
              borderRadius: 5,
              backgroundColor: "#1e1e1e",
              color: "white",
            },
          }}
        />
        {selectedCoin && (
          <>
            <View style={styles.boughtAssetQuantityContainer}>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{ color: "white", fontSize: 90 }}
                  value={boughtAssetQuantity}
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={setboughtAssetQuantity}
                  selectTextOnFocus={false}
                />

                <Text style={styles.ticker}>{selectedCoin.symbol.toUpperCase()}</Text>
              </View>
              <Text style={styles.pricePerCoin}>
                ${selectedCoin.market_data.current_price.usd} per coin
              </Text>
            </View>
            <Pressable
              style={{
                ...styles.buttonContainer,
                backgroundColor: isQuantityEntered() ? "#303030" : "#4169E1",
              }}
              onPress={onAddNewAsset}
              disabled={isQuantityEntered()}
            >
              <Text
                style={{
                  ...styles.butonText,
                  color: isQuantityEntered() ? "grey" : "white",
                }}
              >
                Add New Asset
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </DismissKeyboard>
  );
};

export default AddNewAssetScreen;
