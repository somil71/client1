import Request, { IRequest } from '../models/Request.js';
import { CreateRequestInput, UpdateRequestStatusInput } from '../utils/validation.js';
import EmailService from './EmailService.js';

export class RequestService {
  async createRequest(data: CreateRequestInput, documents: string[] = []): Promise<IRequest> {
    const trackingId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const request = new Request({
      ...data,
      documents,
      trackingId
    });

    const saved = await request.save();

    // Send confirmation email
    try {
      await EmailService.sendRequestConfirmation(data.email, data.name, saved._id.toString());
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return saved;
  }

  async getRequestById(id: string): Promise<IRequest | null> {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    return Request.findOne(isObjectId ? { _id: id } : { trackingId: id }).populate('assignedTo', 'name email');
  }

  async getAllRequests(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {}
  ): Promise<{ requests: IRequest[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.urgencyLevel) {
      query.urgencyLevel = filters.urgencyLevel;
    }
    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }
    if (filters.typeOfHelp) {
      query.typeOfHelp = filters.typeOfHelp;
    }

    const requests = await Request.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(query);

    return {
      requests,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  async getRequestsByUserId(userId: string): Promise<IRequest[]> {
    return Request.find({ userId }).sort({ createdAt: -1 });
  }

  async updateRequestStatus(
    id: string,
    data: UpdateRequestStatusInput
  ): Promise<IRequest | null> {
    const request = await Request.findByIdAndUpdate(
      id,
      {
        status: data.status,
        ...(data.adminNotes && { adminNotes: data.adminNotes }),
        ...(data.responseMessage && { responseMessage: data.responseMessage })
      },
      { new: true, runValidators: true }
    );

    if (request && data.responseMessage) {
      try {
        await EmailService.sendStatusUpdate(
          request.email,
          request.name,
          request.status,
          data.responseMessage
        );
      } catch (error) {
        console.error('Failed to send status update email:', error);
      }
    }

    return request;
  }

  async assignVolunteer(id: string, userId: string): Promise<IRequest | null> {
    return Request.findByIdAndUpdate(
      id,
      { assignedTo: userId },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
  }

  async getStatistics(): Promise<{
    totalRequests: number;
    approvedRequests: number;
    pendingRequests: number;
    completedRequests: number;
    familiesHelped: number;
  }> {
    const stats = await Request.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          completed: [{ $match: { status: 'completed' } }, { $count: 'count' }]
        }
      }
    ]);

    return {
      totalRequests: stats[0].total[0]?.count || 0,
      approvedRequests: stats[0].approved[0]?.count || 0,
      pendingRequests: stats[0].pending[0]?.count || 0,
      completedRequests: stats[0].completed[0]?.count || 0,
      familiesHelped: stats[0].completed[0]?.count || 0
    };
  }
}

export default new RequestService();
