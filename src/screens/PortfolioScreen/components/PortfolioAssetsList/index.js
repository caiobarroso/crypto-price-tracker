import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import PortfolioAssetsItem from "../PortfolioAssetsItem";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue, useRecoilState } from "recoil";
import { allPortfolioAssets } from "../../../../atoms/PortfolioAssets";

const PortfolioAssetsList = () => {
  const navigation = useNavigation();
  const assets = useRecoilValue(allPortfolioAssets);
  
  const getCurrentBalance = () => assets.reduce((total, currentAsset) => total + currentAsset.currentPrice * currentAsset.quantityBought, 0)
  return (
    <View>
      <FlatList
        data={assets}
        renderItem={({ item }) => <PortfolioAssetsItem assetItem={item} />}
        ListHeaderComponent={
          <>
            <View style={styles.balanceContainer}>
              <View style={styles.aaa}>
                <Text style={styles.currentBalance}>Current Balance</Text>
                <Text style={styles.currentBalanceValue}>${getCurrentBalance()}</Text>
                <Text style={styles.valueChange}>$1000 (All Time)</Text>
              </View>

              <View style={styles.priceChancePercentageContainer}>
                <AntDesign
                  name={"caretup"}
                  size={12}
                  color={"white"}
                  style={{ alignSelf: "center", marginRight: 5 }}
                />
                <Text style={styles.percentageChange}>1.2%</Text>
              </View>
            </View>
            <Text style={styles.assetsLabel}>Your Assets</Text>
          </>
        }
        ListFooterComponent={
          <Pressable
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("AddNewAssetScreen")}
          >
            <Text style={styles.butonText}>Add New Asset</Text>
          </Pressable>
        }
      />
    </View>
  );
};

export default PortfolioAssetsList;
