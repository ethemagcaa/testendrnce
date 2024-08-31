package com.jotform.endrnce.common.util;

import java.util.Random;

public class RandomGenerator {
    public static int generateRandomNumber(int digitCount) {
        Random random = new Random();

        int lowerBound = (int) Math.pow(10, digitCount - 1);
        int upperBound = (int) Math.pow(10, digitCount) - 1;

        return random.nextInt(upperBound - lowerBound + 1) + lowerBound;
    }
}
