import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertActionTrackerTemplateSchema, 
  insertDailyActionTrackerSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage with default data
  try {
    await storage.initialize();
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
  
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
