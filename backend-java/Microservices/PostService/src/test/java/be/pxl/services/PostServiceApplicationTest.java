package be.pxl.services;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class PostServiceApplicationTest extends TestCase {

    public PostServiceApplicationTest(String testName) {
        super(testName);
    }

    public static Test suite() {
        return new TestSuite(PostServiceApplicationTest.class);
    }

    public void testApp() {
        assertTrue(true);
    }

}
