import { Request, Response, NextFunction } from 'express';
import RequestService from '../services/RequestService.js';
import { CreateRequestSchema, UpdateRequestStatusSchema, AssignVolunteerSchema, SendMessageSchema } from '../utils/validation.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const createRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = CreateRequestSchema.parse(req.body);
  const documents = req.files ? (req.files as Express.Multer.File[]).map(f => f.filename) : [];

  const requestData: any = { ...validatedData };
  if (req.user) {
    requestData.userId = req.user._id;
  }
  const request = await RequestService.createRequest(requestData, documents);

  res.status(201).json({
    success: true,
    message: 'Request submitted successfully',
    data: {
      id: request._id,
      trackingId: request.trackingId
    }
  });
});

export const getRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const request = await RequestService.getRequestById(req.params.id);

  if (!request) {
    throw new AppError(404, 'Request not found');
  }

  res.json({
    success: true,
    data: request
  });
});

export const getMyRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  const requests = await RequestService.getRequestsByUserId(req.user._id);

  res.json({
    success: true,
    data: requests
  });
});

export const listRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filters = {
    status: req.query.status,
    urgencyLevel: req.query.urgencyLevel,
    city: req.query.city,
    typeOfHelp: req.query.typeOfHelp
  };

  const { requests, total, pages } = await RequestService.getAllRequests(
    page,
    limit,
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
  );

  res.json({
    success: true,
    data: requests,
    pagination: { page, limit, total, pages }
  });
});

export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = UpdateRequestStatusSchema.parse(req.body);
    const request = await RequestService.updateRequestStatus(req.params.id, validatedData);

    if (!request) {
      throw new AppError(404, 'Request not found');
    }

    res.json({
      success: true,
      message: 'Request status updated',
      data: request
    });
  }
);

export const assignVolunteer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = AssignVolunteerSchema.parse(req.body);
    const request = await RequestService.assignVolunteer(req.params.id, validatedData.userId);

    if (!request) {
      throw new AppError(404, 'Request not found');
    }

    res.json({
      success: true,
      message: 'Volunteer assigned',
      data: request
    });
  }
);

export const getStatistics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await RequestService.getStatistics();

    res.json({
      success: true,
      data: stats
    });
  }
);
