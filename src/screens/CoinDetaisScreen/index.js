import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CoinDetailHeader from "./components/CoinDetailHeader";
import { AntDesign } from "@expo/vector-icons";
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartYLabel,
} from "@rainbow-me/animated-charts";
import { useRoute } from "@react-navigation/native";
import styles from "./styles";
import {
  getDetailedCoinData,
  getCoinMarketChart,
} from "../../services/requests";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const CoinDetaisScreen = () => {
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);

  const route = useRoute();
  const {
    params: { coinId },
  } = route;

  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchCoinData = await getDetailedCoinData(coinId);
    const fetchCoinMarketData = await getCoinMarketChart(coinId);
    setCoin(fetchCoinData);
    setCoinMarketData(fetchCoinMarketData);
    setUsdValue(fetchCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  useEffect(() => {
    fetchCoinData();
  }, []);

  if (loading || !coin || !coinMarketData) {
    return <ActivityIndicator size="large" />;
  }

  const {
    id,
    image: { small },
    name,
    symbol,
    market_data: {
      market_cap_rank,
      current_price,
      price_change_percentage_24h,
    },
  } = coin;

  const { prices } = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";
  const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
  const screenWidth = Dimensions.get("window").width;

  const formatCurrency = (value) => {
    "worklet";
    if (value === "") {
      return `$${current_price.usd.toFixed(2)}`;
    }

    return `$${parseFloat(value).toFixed(2)}`;
  };

  const changeCoinValue = (value) => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setUsdValue((floatValue * current_price.usd).toString());
  };

  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setCoinValue((floatValue / current_price.usd).toString());
  };

  return (
    <DismissKeyboard>
      <View style={{ paddingHorizontal: 10 }}>
        <ChartPathProvider
          data={{
            points: prices.map(([x, y]) => ({ x, y })),
            smoothingStrategy: "bezier",
          }}
        >
          <CoinDetailHeader
            coinId={id}
            image={small}
            name={name}
            symbol={symbol}
            marketCapRank={market_cap_rank}
          />
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.name}>{name}</Text>
              <ChartYLabel
                format={formatCurrency}
                style={styles.currentPrice}
              />
              {/* <Text style={styles.currentPrice}>${current_price.usd}</Text> */}
            </View>
            <View
              style={{
                backgroundColor: percentageColor,
                paddingVertical: 8,
                paddingHorizontal: 3,
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              <AntDesign
                name={price_change_percentage_24h < 0 ? "caretdown" : "caretup"}
                size={12}
                color={"white"}
                style={{ alignSelf: "center", marginRight: 5 }}
              />
              <Text style={styles.priceChange}>
                {price_change_percentage_24h?.toFixed(2)}%
              </Text>
            </View>
          </View>
          <View>
            <ChartPath
              strokeWidth={2}
              height={screenWidth / 2}
              stroke={chartColor}
              width={screenWidth}
            />
            <ChartDot style={{ backgroundColor: chartColor }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text style={{ color: "white", alignSelf: "center" }}>
                {symbol.toUpperCase()}
              </Text>
              <TextInput
                style={styles.input}
                value={coinValue}
                keyboardType="numeric"
                onChangeText={changeCoinValue}
              />
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text style={{ color: "white", alignSelf: "center" }}>USD</Text>
              <TextInput
                style={styles.input}
                value={usdValue}
                keyboardType="numeric"
                onChangeText={changeUsdValue}
              />
            </View>
          </View>
        </ChartPathProvider>
      </View>
    </DismissKeyboard>
  );
};

export default CoinDetaisScreen;
