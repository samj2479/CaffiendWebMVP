"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import FooterSection from "../../components/FooterSection";
import { allergyCols, getItemAllergenKeys } from "../../data/allergyData";

const sortOptions = [
  { ko: "인기순", en: "Popular" },
  { ko: "최신순", en: "Latest" },
  { ko: "이름순", en: "Name" },
];

const seasonItems = [
  { ko: "스프링 블라썸 에이드", en: "Spring Blossom Ade", image: "/%EC%8A%A4%ED%94%84%EB%A7%81%20%EB%B8%94%EB%9D%BC%EC%8D%B8%20%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "벚꽃 슈크림 라떼", en: "Cherry Blossom Cream Latte", image: "/%EB%B2%9A%EA%BD%82%20%EC%8A%88%ED%81%AC%EB%A6%BC%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "망고 말차 라떼", en: "Mango Matcha Latte", image: "/%EB%A7%9D%EA%B3%A0%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "산타 메리", en: "Santa Mary", image: "/%EC%82%B0%ED%83%80%20%EB%A9%94%EB%A6%AC.png", season: true },
  { ko: "고구마 크림브륄레 라떼", en: "Sweet Potato Crème Brûlée Latte", image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "청귤티", en: "Green Tangerine Tea", image: "/%EC%B2%AD%EA%B7%A4%ED%8B%B0.png", season: true },
  { ko: "청귤에이드", en: "Green Tangerine Ade", image: "/%EC%B2%AD%EA%B7%A4%20%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "오미자 티", en: "Omija Tea", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%ED%8B%B0.png", season: true },
  { ko: "오미자 에이드", en: "Omija Ade", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "오미자 라떼", en: "Omija Latte", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%20%EB%9D%BC%EB%96%BC.png", season: true },
];

const soufleeItems = [
  { ko: "초코 수플레", en: "Chocolate Soufflé", image: "/%EC%B4%88%EC%BD%94%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "크림브륄레 수플레", en: "Crème Brûlée Soufflé", image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "로투스 수플레", en: "Lotus Soufflé", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "인절미 수플레", en: "Injeolmi Soufflé", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "돼지바 수플레", en: "Chocolate Crunch Soufflé", image: "/%EB%8F%BC%EC%A7%80%EB%B0%94%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "밤 수플레", en: "Chestnut Soufflé", image: "/%EB%B0%A4%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "흑임자 수플레", en: "Black Sesame Soufflé", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "딸기 수플레", en: "Strawberry Soufflé", image: "/%EB%94%B8%EA%B8%B0%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "복숭아 수플레", en: "Peach Soufflé", image: "/%EB%B3%B5%EC%88%AD%EC%95%84%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "무화과 수플레", en: "Fig Soufflé", image: "/%EB%AC%B4%ED%99%94%EA%B3%BC%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "두바이 수플레", en: "Dubai Soufflé", image: "/%EB%91%90%EB%B0%94%EC%9D%B4%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
];

const bingsuItems = [
  { ko: "인절미 팥빙수", en: "Injeolmi Red Bean Bingsu", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EB%B9%99%EC%88%98.png" },
  { ko: "오레오초코 빙수", en: "Oreo Chocolate Bingsu", image: "/%EC%98%A4%EB%A0%88%EC%98%A4%20%EB%B9%99%EC%88%98.png" },
  { ko: "로투스커피 빙수", en: "Lotus Coffee Bingsu", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EB%B9%99%EC%88%98.png" },
  { ko: "망고 빙수", en: "Mango Bingsu", image: "/%EB%A7%9D%EA%B3%A0%20%EB%B9%99%EC%88%98.png" },
  { ko: "흑임자 빙수", en: "Black Sesame Bingsu", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EB%B9%99%EC%88%98.png" },
  { ko: "오디 빙수", en: "Mulberry Bingsu", image: "/%EC%98%A4%EB%94%94%20%EB%B9%99%EC%88%98.png" },
  { ko: "딸기 빙수", en: "Strawberry Bingsu", image: "/%EB%94%B8%EA%B8%B0%20%EB%B9%99%EC%88%98.png" },
  { ko: "복숭아 빙수", en: "Peach Bingsu", image: "/%EB%B3%B5%EC%88%AD%EC%95%84%20%EB%B9%99%EC%88%98.png" },
  { ko: "꿀자몽 빙수", en: "Honey Grapefruit Bingsu", image: "/%EC%9E%90%EB%AA%BD%20%EB%B9%99%EC%88%98.png" },
  { ko: "밤 빙수", en: "Chestnut Bingsu", image: "/%EB%B0%A4%20%EB%B9%99%EC%88%98.png" },
  { ko: "말차 빙수", en: "Matcha Bingsu", image: "/%EB%A7%90%EC%B0%A8%20%EB%B9%99%EC%88%98.png" },
  { ko: "무화과 빙수", en: "Fig Bingsu", image: "/%EB%AC%B4%ED%99%94%EA%B3%BC%20%EB%B9%99%EC%88%98.png" },
  { ko: "두바이 빙수", en: "Dubai Bingsu", image: "/%EB%91%90%EB%B0%94%EC%9D%B4%20%EB%B9%99%EC%88%98.png" },
];

const lightDessertItems = [
  { ko: "미니 쫀득쿠키", en: "Mini Chewy Cookie", image: "/%EB%AF%B8%EB%8B%88%20%EC%AB%80%EB%93%9D%EC%BF%A0%ED%82%A4.png" },
  { ko: "티라미수 볼 (코코아/말차/인절미/로투스)", en: "Tiramisu Ball (Cocoa/Matcha/Injeolmi/Lotus)", image: "/%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98%EB%B3%BC(%EC%BD%94%EC%BD%94%EC%95%84%20%EB%A7%90%EC%B0%A8%20%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EB%A1%9C%ED%88%AC%EC%8A%A4).png" },
  { ko: "1인 티라미수", en: "Single Tiramisu", image: "/1%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png" },
  { ko: "말렌카 (코코아/월넛)", en: "Medovik (Cocoa/Walnut)", image: "/%EB%A7%90%EB%A0%8C%EC%B9%B4(%EC%BD%94%EC%BD%94%EC%95%84%20%EC%9B%94%EB%84%9B).png" },
  { ko: "3~4인 티라미수", en: "Tiramisu for 3–4", image: "/3%204%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png" },
];

const dripItems = [
  { ko: "핸드드립 케냐 AA", en: "Hand Drip Kenya AA", image: "/%ED%95%B8%EB%93%9C%EB%93%9C%EB%A6%BD%20%EC%BC%80%EB%83%90%20AAA.png" },
  { ko: "콜드브루 아이스", en: "Cold Brew Ice", image: "/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%20%EC%95%84%EC%9D%B4%EC%8A%A4.png" },
  { ko: "콜드브루 라떼", en: "Cold Brew Latte", image: "/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%20%EB%9D%BC%EB%96%BC.png" },
];

const coffeeItems = [
  { ko: "에스프레소", en: "Espresso", image: "/%EC%97%90%EC%8A%A4%ED%94%84%EB%A0%88%EC%86%8C.png" },
  { ko: "에소 콘파냐", en: "Espresso con Panna", image: "/%EC%97%90%EC%8F%98%20%EC%BD%98%ED%8C%8C%EB%83%90.png" },
  { ko: "패션후르츠 콘파냐", en: "Passion Fruit con Panna", image: "/%ED%8C%A8%EC%85%98%ED%9B%84%EB%A5%B4%EC%B8%A0%20%EC%BD%98%ED%8C%8C%EB%83%90.png" },
  { ko: "아메리카노", en: "Americano", image: "/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png" },
  { ko: "헤이즐넛 아메리카노", en: "Hazelnut Americano", image: "/%ED%97%A4%EC%9D%B4%EC%A6%90%EB%84%9B%20%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png" },
  { ko: "꿀 아메리카노", en: "Honey Americano", image: "/%EA%BF%80%20%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png" },
  { ko: "사케라또", en: "Shakerato", image: "/%EC%82%AC%EC%BC%80%EB%9D%BC%EB%98%90.png" },
  { ko: "카페라떼", en: "Café Latte", image: "/%EC%B9%B4%ED%8E%98%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "퐁실 카푸치노", en: "Fluffy Cappuccino", image: "/%ED%90%81%EC%8B%A4%20%EC%B9%B4%ED%91%B8%EC%B9%98%EB%85%B8.png" },
  { ko: "바닐라말차샷", en: "Vanilla Matcha Shot", image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%20%EB%A7%90%EC%B0%A8%EC%83%B7.png" },
  { ko: "아가베라떼", en: "Agave Latte", image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%B9%88%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "바닐라빈라떼", en: "Vanilla Bean Latte", image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%B9%88%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "돌체라떼", en: "Dolce Latte", image: "/%EB%8F%8C%EC%B2%B4%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "카라멜마끼야또", en: "Caramel Macchiato", image: "/%EC%B9%B4%EB%9D%BC%EB%A9%9C%EB%A7%88%EB%81%BC%EC%95%BC%EB%98%90.png" },
  { ko: "카페모카", en: "Café Mocha", image: "/%EC%B9%B4%ED%8E%98%EB%AA%A8%EC%B9%B4.png" },
];

const nonCoffeeItems = [
  { ko: "벚꽃 슈크림 라떼", en: "Cherry Blossom Cream Latte", image: "/%EB%B2%9A%EA%BD%82%20%EC%8A%88%ED%81%AC%EB%A6%BC%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "망고 말차 라떼", en: "Mango Matcha Latte", image: "/%EB%A7%9D%EA%B3%A0%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "산타 메리", en: "Santa Mary", image: "/%EC%82%B0%ED%83%80%20%EB%A9%94%EB%A6%AC.png", season: true },
  { ko: "고구마 크림브륄레 라떼", en: "Sweet Potato Crème Brûlée Latte", image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "오미자 라떼", en: "Omija Latte", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%20%EB%9D%BC%EB%96%BC.png", season: true },
  { ko: "말차 숲라떼", en: "Matcha Forest Latte", image: "/%EB%A7%90%EC%B0%A8%20%EC%88%B2%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "고구마라떼", en: "Sweet Potato Latte", image: "/%EA%B3%A0%EA%B5%AC%EB%A7%88%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "로얄밀크티", en: "Royal Milk Tea", image: "/%EB%A1%9C%EC%96%84%20%EB%B0%80%ED%81%AC%ED%8B%B0.png" },
  { ko: "수제초코라떼", en: "Homemade Chocolate Latte", image: "/%EC%88%98%EC%A0%9C%20%EC%B4%88%EC%BD%94%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "딸기라떼", en: "Strawberry Latte", image: "/%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC.png" },
  { ko: "흑말 라떼", en: "Black Sesame Matcha Latte", image: "/%ED%9D%91%EB%A7%90%EB%9D%BC%EB%96%BC.png" },
  { ko: "초코크림딸기라떼", en: "Chocolate Cream Strawberry Latte", image: "/%EC%B4%88%EC%BD%94%ED%81%AC%EB%A6%BC%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC.png" },
  { ko: "인절미말차라떼", en: "Injeolmi Matcha Latte", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png" },
];

const einItems = [
  { ko: "아인슈페너", en: "Einspänner", image: "/%EC%95%84%EC%9D%B8%EC%8A%88%ED%8E%98%EB%84%88.png" },
  { ko: "로투스 카라멜라떼", en: "Lotus Caramel Latte", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EC%B9%B4%EB%9D%BC%EB%A9%9C%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "헤이즐토피넛라떼", en: "Hazel Toffee Nut Latte", image: "/%ED%97%A4%EC%9D%B4%EC%A6%90%ED%86%A0%ED%94%BC%EB%84%9B%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "옥수수슈페너", en: "Corn Einspänner", image: "/%EC%98%A5%EC%88%98%EC%88%98%EC%8A%88%ED%8E%98%EB%84%88.png" },
  { ko: "얼그레이 바닐라티라떼", en: "Earl Grey Vanilla Tea Latte", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%EC%B9%B4%EB%9D%BC%EB%A9%9C%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "런던포그", en: "London Fog", image: "/%EB%9F%B0%EB%8D%98%ED%8F%AC%EA%B7%B8.png" },
  { ko: "흑임자 슈페너", en: "Black Sesame Einspänner", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%8A%88%ED%8E%98%EB%84%88.png" },
  { ko: "에쏘 아포가토", en: "Espresso Affogato", image: "/%EC%97%90%EC%8F%98%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png" },
  { ko: "숲 아포가토", en: "Forest Affogato", image: "/%EC%88%B2%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png" },
  { ko: "흑임자 아포가토", en: "Black Sesame Affogato", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png" },
];

const teaItems = [
  { ko: "청귤티", en: "Green Tangerine Tea", image: "/%EC%B2%AD%EA%B7%A4%ED%8B%B0.png", season: true },
  { ko: "오미자 티", en: "Omija Tea", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%ED%8B%B0.png", season: true },
  { ko: "허브티", en: "Herb Tea", image: "/%ED%97%88%EB%B8%8C%ED%8B%B0%20.png" },
  { ko: "아이스티", en: "Iced Tea", image: "/%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B0.png" },
  { ko: "꿀생강차", en: "Honey Ginger Tea", image: "/%EA%BF%80%EC%83%9D%EA%B0%95%EC%B0%A8.png" },
  { ko: "레몬생강차", en: "Lemon Ginger Tea", image: "/%EB%A0%88%EB%AA%AC%EC%83%9D%EA%B0%95%EC%B0%A8.png" },
  { ko: "유자차", en: "Yuzu Tea", image: "/%EC%9C%A0%EC%9E%90%EC%B0%A8.png" },
  { ko: "꿀대추차", en: "Honey Jujube Tea", image: "/%EA%BF%80%EB%8C%80%EC%B6%94%EC%B0%A8%20.png" },
  { ko: "레몬티", en: "Lemon Tea", image: "/%EB%A0%88%EB%AA%AC%ED%8B%B0.png" },
  { ko: "애플유자티", en: "Apple Yuzu Tea", image: "/%EC%95%A0%ED%94%8C%EC%9C%A0%EC%9E%90%ED%8B%B0.png" },
  { ko: "허니자몽블랙티", en: "Honey Grapefruit Black Tea", image: "/%ED%97%88%EB%8B%88%EC%9E%90%EB%AA%BD%EB%B8%94%EB%9E%99%ED%8B%B0.png" },
  { ko: "허니딸기블랙티", en: "Honey Strawberry Black Tea", image: "/%ED%97%88%EB%8B%88%EB%94%B8%EA%B8%B0%EB%B8%94%EB%9E%99%ED%8B%B0.png" },
];

const adeItems = [
  { ko: "스프링 블라썸 에이드", en: "Spring Blossom Ade", image: "/%EC%8A%A4%ED%94%84%EB%A7%81%20%EB%B8%94%EB%9D%BC%EC%8D%B8%20%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "청귤에이드", en: "Green Tangerine Ade", image: "/%EC%B2%AD%EA%B7%A4%20%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "오미자 에이드", en: "Omija Ade", image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%EC%97%90%EC%9D%B4%EB%93%9C.png", season: true },
  { ko: "자몽에이드", en: "Grapefruit Ade", image: "/%EC%9E%90%EB%AA%BD%EC%97%90%EC%9D%B4%EB%93%9C.png" },
  { ko: "레몬 에이드", en: "Lemon Ade", image: "/%EB%A0%88%EB%AA%AC%EC%97%90%EC%9D%B4%EB%93%9C%20.png" },
  { ko: "패션후르츠 에이드", en: "Passion Fruit Ade", image: "/%ED%8C%A8%EC%85%98%ED%9B%84%EB%A5%B4%EC%B8%A0%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
  { ko: "얼그레이유자 에이드", en: "Earl Grey Yuzu Ade", image: "/%EC%96%BC%EA%B7%B8%EB%A0%88%EC%9D%B4%20%EC%9C%A0%EC%9E%90%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
  { ko: "바질토마토 에이드", en: "Basil Tomato Ade", image: "/%EB%B0%94%EC%A7%88%20%ED%86%A0%EB%A7%88%ED%86%A0%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
];

const smoothieItems = [
  { ko: "미숫가루", en: "Misugaru", image: "/%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A8.png" },
  { ko: "냉귀리 쉐이크", en: "Cold Oat Shake", image: "/%EB%83%89%EA%B7%80%EB%A6%AC%EC%89%90%EC%9D%B4%ED%81%AC.png" },
  { ko: "그릭요거드 (그래놀라/딸기/블루베리/망고)", en: "Greek Yogurt (Granola/Strawberry/Blueberry/Mango)", image: "/%EA%B7%B8%EB%A6%AD%EC%9A%94%EA%B1%B0%ED%8A%B8(%EA%B7%B8%EB%9E%98%EB%86%80%EB%9D%BC%20%EB%94%B8%EA%B8%B0%20%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%20%EB%A7%9D%EA%B3%A0).png" },
  { ko: "배 스무디", en: "Pear Smoothie", image: "/%EB%B0%B0%EC%88%98%EB%AC%B4%EB%94%94.png" },
  { ko: "유자 스무디", en: "Yuzu Smoothie", image: "/%EC%9C%A0%EC%9E%90%EC%8A%A4%EB%AC%B4%EB%94%94.png" },
];

const categories = [
  {
    ko: "전체", en: "All",
    sub: null,
    items: [
      ...seasonItems, ...soufleeItems, ...bingsuItems, ...lightDessertItems,
      ...dripItems, ...coffeeItems, ...nonCoffeeItems, ...einItems,
      ...teaItems, ...adeItems, ...smoothieItems,
    ],
  },
  {
    ko: "시즌 메뉴", en: "Season Menu",
    sub: null,
    items: seasonItems,
  },
  {
    ko: "디저트", en: "Desserts",
    sub: [
      { ko: "수플레", en: "Soufflé", items: soufleeItems },
      { ko: "빙수", en: "Bingsu", items: bingsuItems },
      { ko: "간편 디저트", en: "Light Desserts", items: lightDessertItems },
    ],
    items: [],
  },
  {
    ko: "음료", en: "Drinks",
    sub: [
      { ko: "드립/더치", en: "Drip/Dutch", items: dripItems },
      { ko: "커피", en: "Coffee", items: coffeeItems },
      { ko: "논커피 라떼", en: "Non-Coffee Latte", items: nonCoffeeItems },
      { ko: "아인슈페너/아포가토", en: "Einspänner/Affogato", items: einItems },
      { ko: "티", en: "Tea", items: teaItems },
      { ko: "에이드", en: "Ade", items: adeItems },
      { ko: "스무디", en: "Smoothie", items: smoothieItems },
    ],
    items: [],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Page() {
  const { lang } = useLanguage();
  const [activeSort, setActiveSort] = useState(0);
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const sortRef = useRef<HTMLDivElement>(null);

  function toggleFlip(ko: string) {
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(ko) ? next.delete(ko) : next.add(ko);
      return next;
    });
  }

  const activeCat = categories[activeCatIndex];
  const allItems = categories[0].items;

  const menuItems = (() => {
    if (activeCat.sub) {
      return activeCat.sub[activeSubIndex]?.items ?? [];
    }
    return activeCat.items;
  })();

  const displayItems = (() => {
    const q = searchQuery.trim().toLowerCase();
    const base = q
      ? allItems.filter((item) => item.ko.toLowerCase().includes(q) || item.en.toLowerCase().includes(q))
      : menuItems;
    if (activeSort === 2) {
      return [...base].sort((a, b) =>
        lang === "ko" ? a.ko.localeCompare(b.ko, "ko") : a.en.localeCompare(b.en, "en")
      );
    }
    return base;
  })();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCatClick(i: number) {
    setActiveCatIndex(i);
    setActiveSubIndex(0);
    setSearchQuery("");
  }

  return (
    <main>
      <section className="min-h-screen flex flex-col bg-[#FAF7F2] relative pt-[100px] md:pt-[140px] px-4 sm:px-6 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto w-full">

          {/* Title */}
          <h1
            className="font-serif font-bold text-black text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            MENU
          </h1>

          {/* Category + Search + Sort */}
          <div className="flex flex-col gap-3 mt-8 md:flex-row md:items-center md:justify-between" ref={sortRef}>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => handleCatClick(i)}
                  className={`font-sans text-sm px-6 py-2.5 rounded-full border transition-all ${
                    activeCatIndex === i
                      ? "bg-caramel text-white border-caramel"
                      : "bg-[#FAF7F2] text-black/70 border-black/20 hover:border-black/40"
                  }`}
                >
                  {lang === "ko" ? cat.ko : cat.en}
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-3 md:flex-shrink-0">
              <div className="relative flex-1 md:flex-none">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                  width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "ko" ? "검색..." : "Search..."}
                  className="w-full md:w-40 font-sans text-sm pl-8 pr-7 py-2 rounded-full border border-[#174C35]/30 bg-[#FAF7F2] text-[#174C35] placeholder:text-[#174C35]/40 focus:outline-none focus:border-[#174C35] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <span className="hidden md:inline font-sans text-sm text-black/50">{lang === "ko" ? "정렬" : "Sort"}</span>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 font-sans text-sm px-4 py-2 rounded-full border border-[#174C35]/30 bg-[#FAF7F2] text-[#174C35] hover:border-[#174C35] transition-all"
                >
                  {lang === "ko" ? sortOptions[activeSort].ko : sortOptions[activeSort].en}
                  <ChevronIcon open={sortOpen} />
                </button>
                {sortOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-[#FAF7F2] border border-black/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                    {sortOptions.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveSort(i); setSortOpen(false); }}
                        className={`w-full text-left font-sans text-sm px-4 py-2.5 transition-colors ${
                          activeSort === i ? "bg-[#174C35]/10 text-[#174C35]" : "text-[#174C35]/70 hover:bg-[#174C35]/5"
                        }`}
                      >
                        {lang === "ko" ? option.ko : option.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-category row (only for 디저트 / 음료) */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: activeCat.sub ? "120px" : "0px",
              opacity: activeCat.sub ? 1 : 0,
              marginTop: activeCat.sub ? "16px" : "0px",
            }}
          >
            <div className="flex flex-wrap justify-start gap-2">
              {(activeCat.sub ?? []).map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSubIndex(i)}
                  className={`font-sans text-xs px-4 py-1.5 rounded-full border transition-all ${
                    activeSubIndex === i
                      ? "bg-[#174C35] text-white border-[#174C35]"
                      : "bg-[#FAF7F2] text-[#174C35]/60 border-[#174C35]/20 hover:border-[#174C35]/50 hover:text-[#174C35]"
                  }`}
                >
                  {lang === "ko" ? sub.ko : sub.en}
                </button>
              ))}
            </div>
          </div>

          {/* Menu grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayItems.length === 0 && (
              <p className="col-span-full text-center font-sans text-sm text-black/40 py-12">
                {lang === "ko" ? "검색 결과가 없습니다." : "No results found."}
              </p>
            )}
            {displayItems.map((item, i) => {
              const isFlipped = flipped.has(item.ko);
              const allergenKeys = getItemAllergenKeys(item.ko);
              const allergenLabel = allergenKeys.length === 0
                ? (lang === "ko" ? "없음" : "None")
                : allergenKeys.map(k => {
                    const col = allergyCols.find(c => c.key === k);
                    return lang === "ko" ? col?.ko : col?.en;
                  }).join(", ");
              const imgSrc = (item as { image?: string }).image;
              return (
                <div key={i} className="relative flex flex-col">
                  {(item as { season?: boolean }).season && (
                    <span className="absolute -top-1 -left-1 z-10 bg-[#174C35] text-white font-sans text-xs font-semibold px-3 py-1 leading-tight">
                      {lang === "ko" ? "시즌" : "Seasonal"}
                    </span>
                  )}

                  {/* Flip card */}
                  <div
                    className="menu-flip-wrap bg-[#FAF7F2] cursor-pointer w-full"
                    style={{ paddingBottom: "100%" }}
                    onClick={() => toggleFlip(item.ko)}
                  >
                    <div className={`menu-flip-inner${isFlipped ? " flipped" : ""}`}>

                      {/* Front */}
                      <div className="menu-flip-front">
                        {imgSrc && (
                          <Image
                            src={imgSrc}
                            alt={lang === "ko" ? item.ko : item.en}
                            fill
                            quality={80}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            style={{ objectPosition: (item as { objectPosition?: string }).objectPosition ?? "center" }}
                            priority={i < 4}
                          />
                        )}
                      </div>

                      {/* Back */}
                      <div className="menu-flip-back" style={{ background: "#FAF7F2" }}>
                        {imgSrc && (
                          <Image
                            src={imgSrc}
                            alt=""
                            aria-hidden
                            fill
                            quality={80}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            style={{ opacity: 0.15, objectPosition: (item as { objectPosition?: string }).objectPosition ?? "center" }}
                          />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center gap-1">
                          <p className="font-serif font-bold text-black leading-tight" style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>
                            {lang === "ko" ? item.ko : item.en}
                          </p>
                          <p className="font-sans text-black/50 leading-tight" style={{ fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)" }}>
                            {lang === "ko" ? item.en : item.ko}
                          </p>
                          <div style={{ width: "60%", height: 1, background: "rgba(0,0,0,0.2)", margin: "6px 0" }} />
                          <p className="font-sans font-semibold text-black/60" style={{ fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)" }}>
                            {lang === "ko" ? "알레르기 정보" : "Allergen Info"}
                          </p>
                          <p className="font-sans text-black/80 leading-snug" style={{ fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)" }}>
                            {allergenLabel}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <p className="font-sans text-sm md:text-base text-black mt-3 text-center">
                    {lang === "ko" ? item.ko : item.en}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      <FooterSection />
    </main>
  );
}
