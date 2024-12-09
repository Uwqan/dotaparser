package com.mda.dotaparser.controllers;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

    @Controller
    public class MainController {
        private final Map<String, Integer> heroScore = new HashMap<>();

        @GetMapping("/")
        public String home() {
            return "home";
        }

        @PostMapping("/")
        @ResponseBody
        public ResponseEntity<?> processSelection(@RequestBody(required = false) Map<String, Object> payload) {
            if (payload == null || !payload.containsKey("heroes")) {
                return ResponseEntity.ok().build();
            }

            List<String> heroes = (List<String>) payload.get("heroes");

            return ResponseEntity.ok(getCounters(heroes));
        }

    static class CounterPick {
        private String name;
        private String img;
        private int score;

        public CounterPick(String name, String img, int score) {
            this.name = name;
            this.img = img;
            this.score = score;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getImg() {
            return img;
        }

        public void setImg(String img) {
            this.img = img;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }
    }

    private List<CounterPick> getCounters(List<String> heroes){
        List<CounterPick> counterPicks = new ArrayList<>();

        for(String hero : heroes) addScoresHeroes(getCountersForHero(hero));
        for(String hero : heroes) heroScore.remove(hero);

        getTop5LeastValues(heroScore).forEach(stringIntegerEntry -> counterPicks.add(new CounterPick(stringIntegerEntry.getKey(), "/js/content/heroes/" + stringIntegerEntry.getKey() + ".png", stringIntegerEntry.getValue())));
        heroScore.clear();
        return counterPicks;
    }

    public static List<Map.Entry<String, Integer>> getTop5LeastValues(Map<String, Integer> map) {
        return map.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .collect(Collectors.toList());
    }

    private void addScoresHeroes(List<String> heroes){
        int i = 1;

        for(String hero: heroes){
            if (heroScore.containsKey(hero)) heroScore.replace(hero, heroScore.get(hero) + i);
            else heroScore.put(hero, i);
            i++;
        }
    }

    private List<String> getCountersForHero(String hero) {
        try {
            Document document = Jsoup.connect("https://ru.dotabuff.com/heroes/" + hero.toLowerCase().replace(" ", "-") + "/counters").get();
            var titleElement = document.select("html > body > div.container-outer.seemsgood > div.skin-container > div.container-inner.container-inner-content > div.content-inner > section > article > table.sortable > tbody > tr");
            return getHeroes(titleElement.text());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static List<String> getHeroes(String full) {
        String heroRegex = "([A-Za-z'\\s.-]+?)(?= [\\-]?\\d+\\.\\d+% \\d+\\.\\d+%)";

        Pattern pattern = Pattern.compile(heroRegex);
        Matcher matcher = pattern.matcher(full);

        List<String> heroNames = new ArrayList<>();

        while (matcher.find()) {
            String heroName = matcher.group(1).trim();
            heroNames.add(heroName);
        }

        return heroNames;
    }
}
