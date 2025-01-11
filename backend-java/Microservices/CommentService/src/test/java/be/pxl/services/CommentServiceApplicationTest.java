package be.pxl.services;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class CommentServiceApplicationTest extends TestCase {

    public CommentServiceApplicationTest(String testName) {
        super(testName);
    }

    public static Test suite() {
        return new TestSuite(CommentServiceApplicationTest.class);
    }

    public void testApp() {
        assertTrue(true);
    }
}
