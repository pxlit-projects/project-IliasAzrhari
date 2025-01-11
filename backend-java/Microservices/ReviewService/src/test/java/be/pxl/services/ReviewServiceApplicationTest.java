package be.pxl.services;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class ReviewServiceApplicationTest extends TestCase {

    public ReviewServiceApplicationTest(String testName) {
        super(testName);
    }

    public static Test suite() {
        return new TestSuite(ReviewServiceApplicationTest.class);
    }

    public void testApp() {
        assertTrue(true);
    }
}
