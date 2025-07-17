import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertActionTrackerTemplateSchema, 
  insertDailyActionTrackerSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage with default data
  try {
    await storage.initialize();
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }

  // Authentication Routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In production, use proper password hashing (bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.emailVerified) {
        return res.status(401).json({ 
          error: 'Email not verified', 
          requiresVerification: true 
        });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role, 
          centerId: user.centerId 
        } 
      });
    } catch (error) {
      res.status(400).json({ error: 'Invalid login data' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Generate verification token
      const verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const newUser = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: userData.password, // In production, hash this
        role: userData.role,
        centerId: userData.centerId,
        emailVerificationToken: verificationToken,
        emailVerified: false
      });

      // In production, send verification email here
      console.log(`Email verification token for ${userData.email}: ${verificationToken}`);

      res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification.',
        requiresVerification: true 
      });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid verification token' });
      }

      await storage.updateUser(user.id, {
        emailVerified: true,
        emailVerificationToken: null
      });

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Email verification failed' });
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: 'If the email exists, a reset link has been sent.' });
      }

      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

      await storage.updateUser(user.id, {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry
      });

      // In production, send reset email here
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (error) {
      res.status(400).json({ error: 'Password reset request failed' });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      await storage.updateUser(user.id, {
        password: password, // In production, hash this
        passwordResetToken: null,
        passwordResetExpiry: null
      });

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Password reset failed' });
    }
  });

  app.post('/api/auth/change-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const { userId } = req.body; // In production, get this from session/JWT
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      if (user.password !== currentPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      await storage.updateUser(user.id, {
        password: newPassword // In production, hash this
      });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Password change failed' });
    }
  });

  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: 'Email already verified' });
      }

      const verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      await storage.updateUser(user.id, {
        emailVerificationToken: verificationToken
      });

      // In production, send verification email here
      console.log(`New verification token for ${email}: ${verificationToken}`);

      res.json({ message: 'Verification email sent' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to resend verification email' });
    }
  });
  
  // Action Tracker Templates Routes
  app.get('/api/action-tracker-templates', async (req, res) => {
    try {
      const templates = await storage.getActionTrackerTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action tracker templates' });
    }
  });

  app.get('/api/action-tracker-templates/:role', async (req, res) => {
    try {
      const { role } = req.params;
      const templates = await storage.getActionTrackerTemplatesByRole(role);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action tracker templates by role' });
    }
  });

  app.post('/api/action-tracker-templates', async (req, res) => {
    try {
      const templateData = insertActionTrackerTemplateSchema.parse(req.body);
      const template = await storage.createActionTrackerTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: 'Invalid template data' });
    }
  });

  app.put('/api/action-tracker-templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const templateData = req.body;
      const template = await storage.updateActionTrackerTemplate(parseInt(id), templateData);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update template' });
    }
  });

  app.delete('/api/action-tracker-templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteActionTrackerTemplate(parseInt(id));
      if (!success) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete template' });
    }
  });

  // Daily Action Trackers Routes
  app.get('/api/daily-action-trackers', async (req, res) => {
    try {
      const { userId, centerId, date } = req.query;
      const queryDate = date ? new Date(date as string) : new Date();
      
      let trackers;
      if (userId) {
        trackers = await storage.getDailyActionTrackers(parseInt(userId as string), queryDate);
      } else if (centerId) {
        trackers = await storage.getDailyActionTrackersByCenter(centerId as string, queryDate);
      } else {
        return res.status(400).json({ error: 'userId or centerId required' });
      }
      
      res.json(trackers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch daily action trackers' });
    }
  });

  app.post('/api/daily-action-trackers', async (req, res) => {
    try {
      const trackerData = insertDailyActionTrackerSchema.parse(req.body);
      const tracker = await storage.createDailyActionTracker(trackerData);
      res.status(201).json(tracker);
    } catch (error) {
      res.status(400).json({ error: 'Invalid tracker data' });
    }
  });

  app.put('/api/daily-action-trackers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const trackerData = req.body;
      const tracker = await storage.updateDailyActionTracker(parseInt(id), trackerData);
      if (!tracker) {
        return res.status(404).json({ error: 'Tracker not found' });
      }
      res.json(tracker);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update tracker' });
    }
  });

  // Users Routes (for role-based access)
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await storage.updateUser(parseInt(id), userData);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update user' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
